# Philately

Philately is super easy to use rendering engine for HTML5 `<canvas>`. You have a renderer, some layers and that's all. Simple as that. Great for games, interactive media or just drawing some images to the canvas.

```js
import { Layer, Engine } from 'philately';

// Layers area resolved as promises. So, don't worry about images not being ready.
const myLayer = new Layer({ imageSrc: './myAwesomeImage.png' });

const myEngine = new Engine({
  target: '#my-canvas-element',
  layers: [myLayer],
});

// Boom! You've got it working!
```

## Getting started

Philately is made out of two modules: **Layer** and **Engine**. They work together to create a sensible approach to working with canvas.

**Layer** takes an image URL (or base64) or an element (`<img>` or `<canvas>`) as the source to be drawn. It also gives you some display controls, like opacity and position.

**Engine** renders an array of `Layer` instances to a target `<canvas>`. It can also render continuously, offering a pre-render hook.

A basic Philately setup is as simple as:

```js
import { Engine, Layer } from 'philately';

const myEngine = new Engine({
  target: '#target',
  layers: [
    new Layer({ imageSrc: 'path/to/image_01.png', opacity: 0.5 }),
    new Layer({ source: document.querySelector('#onscreen-image'), posX: 100 }),
    new Layer({ source: '.onscreen-canvas', isActive: false }),
  ],
});
```

Don't worry about preloading images. The engine will wait for all layers' promises to resolve before the first render.
The third layer is deactivated and will be skipped.

---

You could also create an offscreen canvas and add it to the engine:

```js
import { Engine, Layer } from 'philately';

// Creates an empty engine right away
const myEngine = new Engine({
  target: '#my-target',
  autoStart: true,
});

// Creates a <canvas> element and draws a circle on it
const myCanvas = document.createElement('canvas');
const ctx = myCanvas.getContext('2d');
const radius = 50;

myCanvas.width = radius * 2;
myCanvas.height = radius * 2;
ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
ctx.fill();

// Creates an animated layer from the canvas
const my layer = new Layer({
  source: myCanvas,
  onStep: () => myLayer.posX++,
});

// Adds it to the engine
myEngine.addLayer(myLayer);
```

# API

## `Layer`

### Constructor options

```js
new Layer({
  posX: 0, // X position [number]
  posY: 0, // Y position [number]
  opacity: 1, // Opacity [number]
  isActive: true, // Is layer enabled [boolean]
  onStep: ({ now, offset, width, height }, layer) => {}, // Pre-render hook [function]

  // It is required that one of the following are set. `imageSrc` takes precedence over `source`
  imageSrc: 'image.jpg', // Path to image source [string]
  source: '.canvas-or-image', // Layer source element [string, HTMLImageElement or HTMLCanvasElement]
});
```

### Properties

- `source promise`: _[read only]_ Promise that resolves as soon as the source is ready
- `source`: _[read only]_ Reference to the dom element of the source
- `size`: _[read only]_ An object containing the `width` and `height` of the layer source
- `posX`: The X position of the layer
- `posY`: The Y position of the layer
- `opacity`: A number from 0 to 1 representing the opacity of the layer
- `isActive`: A boolean for enabling/disabling the layer
- `onStep`: A function that is called before each rendering cycle. The parameters passed are [`renderParams`](#renderParams)
  (same as in `Engine`) and `layer` (a reference to the layer itself)

### Methods

- `toggle()`: Toggles the layer between enabled and disabled

## `Engine`

### Constructor options

```js
new Engine({
  target: '.target-canvas', // `Engine` target element [string or HTMLCanvasElement]
  layers: [], // An array of `Layer` instances [array]
  autoStart: false, // Start engine's refresh cycle as soon as layers are ready [boolean]
  autoResize: true, // Bind the target canvas' width and height to the element's display size [boolean]
  onStep: ({ now, offset, width, height }) => {}, // Pre-render hook [function]
});
```

### Properties

- `target`: The target `<canvas>` element for the engine to be rendered on. It should be a selector string
  or the HTMLCanvasElement dom reference
- `layers`: An array of `Layer` instances to be rendered. The last item in the array is rendered on top
- `auto-resize`: A boolean indicating if the target [canvas' width and height](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#Attributes) to the element's display size
- `isRunning`: _[read only]_ A boolean indicating if the engine's refresh cycle is active
- `onStep`: A function that is called before each rendering cycle. A [`renderParams` object](#renderParams) is passed
  to the function.

#### `renderParams`

An object that is passed to the `onStep` function. It contains the following properties:

- `now`: A [high-resolution timestamp](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) since the beginning
  of the application
- `offset`: The difference (in milliseconds) since the last refresh cycle
- `width`: The width of the target canvas. Only available if the target `<canvas>` is set.
- `height`: The height of the target canvas. Only available if the target `<canvas>` is set.

## Methods

- `addLayer( layer, shouldDraw = true )`: Adds a `Layer` instance the top of the layer stack. By default, draws to the target
  once the layer is ready.
- `removeLayer( layer, should draw = true )`: Removes a layer from the stack. If the layer was added to the engine multiple
  times, only the first occurrence is removed. By default, updates the target canvas after removing the layer.
- `draw()`: Draws the layer stack to the target `<canvas>`. Especially useful to update the graphics when the engine `autoStart`
  option was set to `false` or the `stop()` method has been called.
- `clear()`: Clears the target `<canvas>`.
- `start()`: Starts the rendering loop.
- `stop()`: Stops the rendering loop.

# Caveats

- Since adding layers to an engine happens in an async mode, race conditions might happen. To handle any issues, you can use
  the promise exposed in `myLayer.sourcePromise` and/or avoid drawing to the canvas by passing the `shouldDraw` parameter as false to `addLayer`. Eg.: `myEngine.addLayer(myLayer, false)`.
- The `<canvas>` element may easily become "tainted" by CORS. That should not be a problem for basic layer rendering, but can be a challenge if you need to do some advanced image processing. To avoid that, you could use some of the solutions [shown in MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image) or use base64 encoded images.

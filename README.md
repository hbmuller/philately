# RushJS

The **RushJS** library is a super easy to use rendering engine for the HTML5 `<canvas>` element. It implements layer support with a rendering loop in a super straightforward package. Great for games, interactive media or just drawing some images to the canvas.

⚠️ **The library has just been refactored into ES6, adding some new features. So, these docs might not be accurate. The documentation update is already on the way.** ⚠️

##Structure
RushJS is based on two main "classes": the **RushLayer** and the **RushEngine**. They work together to create a sensible approach to working with canvas.

**RushLayer** takes a source DOM element to be drawn in canvas and gives you some display controls, like opacity and position. The source can be either an `<img>` element or another `<canvas>` element, which may not need to be onscreen.

**RushEngine** handles the layer stack, renders the layers and runs a rendering loop that offers callbacks both before and after the drawing process.

##Getting started
A basic RushJS setup is as simple as:

```javascript
// An image layer, using a selector to pick the source
var myLayer = new RushLayer({ source: '.my-image' });

// The actual engine
var myEngine = new RushEngine({
  target: '.my-canvas',
  layers: [myLayer],
});
```

This will start the engine with the layer being drawn at the top left of the target canvas.

We could create an offscreen canvas:

```javascript
// Creates a <canvas> element
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

// Sets the canvas size
var r = 50;
canvas.width = r * 2;
canvas.height = r * 2;

// Draws a circle to the canvas
ctx.arc(r, r, r, 0, 2 * Math.PI);
ctx.fill();
```

And then add it to our engine:

```javascript
// Creates the new layer
var canvasLayer = new RushLayer({
  source: canvas,
  x: 300,
  y: 200,
  opacity: 0.5,
});

// Adds it to the engine
myEngine.addLayer(canvasLayer);
```

## RushLayer methods

###Constructor
RushLayer( options )

**Parameters:** _options_ [*object*] A literal object which accepts the following options:

- **source**: [*string* or *object*] A selector indicating an image or canvas element in the current document; or an element object, being either an instance of `HTMLImageElement` or `HTMLCanvasElement`.
- **label**: [*string*] A textual label for the layer. Used mainly for searching for a layer and removing it.
- **opacity**: [*number*] A decimal number from 0 to 1 representing the layer opacity.
- **active**: [*boolean*] A boolean used to turn layer rendering on (`true`) or off (`false`).
- **x**: [*number*] The horizontal position of the layer, relative to the canvas size.
- **y**: [*number*] The vertical position of the layer, relative to the canvas size.

---

### .source( [element] )

Gets or sets the source element of the layer. If the "element" parameter is provided, updates the source.

**Parameters**: _element_ [*string* or *object*] A selector indicating an image or canvas element in the current document; or an element object, being either an instance of `HTMLImageElement` or `HTMLCanvasElement`.

**Return value:** the source DOM element object of the layer. If an invalid "element" parameter is provided, returns `false`.

---

### .label( [label] )

Gets or sets a label for the layer. If an string is provided as the "label" parameter, updates the label.

**Parameters**: _label_ [*string*] A textual label for the layer. Used mainly for searching for a layer and removing it.

**Return value:** the layer's label string. If an invalid parameter is provided, returns `false`.

---

### .opacity( [opacity] )

Gets or sets the opacity of the layer. If the "opacity" parameter is provided, updates the opacity.

**Parameters**: _opacity_ [*number*] A decimal number from 0 to 1 representing the layer opacity.

**Return value:** a decimal number from 0 to 1. If an invalid parameter is provided, returns `false`.

---

### .active( [active] )

Gets or sets the rendering state of the layer. If the "active" parameter is provided, updates the control.

**Parameters**: _active_ [*boolean*] A boolean used to turn layer rendering on (`true`) or off (`false`).

**Return value:** a boolean representing rendering control of the layer.

---

### .position( [x, y] )

Gets or sets the position of the layer. If **both "x" and "y"** parameters are provided, updates the position.

**Parameters**: _x_ and _y_ [*number*] Numbers representing the the horizontal (x) and vertical (y) coordinates of the layer, relative to the canvas displayed size.
_More about that in the `RushEngine.setCanvasSize()` section below._

**Return value:** a literal object containing the x and y coordinates of the layer.

## RushEngine methods

### Constructor

    RushEngine( options )

**Parameters:** _options_ [*object*] A literal object which accepts the following options:

- **target**: [*string* or *object*] The canvas element to display the engine on, being: a selector indicating a canvas element in the current document; or an element object that is an instance of `HTMLCanvasElement`.
- **stepStart**: [*function*] A function to be run at every cycle of the rendering loop **before** the layers are drawn. Receives three parameters:
  - `offset`: the amount of milliseconds since last cycle;
  - `now`: the amount of milliseconds since the page started;
  - `canvasSize`: an object with the width and height of the target canvas.
- **stepEnd**: [*function*] A function to be run at every cycle of the rendering loop **after** the layers are drawn. Receives the same three parameters as the `stepStart` option.
- **layers**: [*array*] An array of `RushLayer` instances to render on the target canvas.
- **autoStart**: [*boolean*] Specifyes if the rendering loop should start as soon as the engine is created. The default value is `true`. If set to `false`, the rendering can be manually called using the `.draw()` method.

---

### .target( canvas )

Gets or sets the target `<canvas>` element of the engine. If the "canvas" parameter is provided, updates the target.

**Parameters**: _canvas_ [*string* or *object*] A selector indicating a canvas element in the current document; or an element object, being an instance of `HTMLCanvasElement`.

**Return value:** the target DOM element object where the engine is rendered. If an invalid "element" parameter is provided, returns `false`.

---

### .setCanvasSize(width,height)

Sets the displayed size of the target `<canvas>` element. This can be used to render stretched graphics, which may enhance the application performance. If no parameter is provided, sets the width and height to the actual size of the canvas. [Check it out in MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#Sizing_the_canvas).

**Parameters**: _width_ and _height_ [*number*] Positive numbers representing the desired displayed size.

**Return value:** _none_.

---

### .resetLayers( layers )

Removes all the layers from the layer stack. New layers may be provided as an array of `RushLayer` instances.

**Parameters**: _layers_ [*array*] An array of `RushLayer` instances to be rendered on the target canvas.

**Return value:** _none_.

---

### .addLayer( layer )

Adds a single `RushLayer` instance the top of the layer stack.

**Parameters**: _layer_ [*object*] An instance of the `RushLayer` class.

**Return value:** An integer indicating the new size of the layer stack. If an invalid _layer_ parameter is provided, returns `false`.

---

### .removeLayer( layer )

Removes one or more layers from the layer stack.

If the "layer" parameter matches a layer that was added to the engine multiple times, all of its occurrences will be removed. Also, if the "label" option of multiple layers matches a string provided as the "layer" parameter, all of these layers will be removed.

**Parameters**: _layer_ [*object* or *string*] An instance of the `RushLayer` class; or a non-empty string matching the "label" option of the layer(s) to be removed.

**Return value:** An integer indicating the new size of the layer stack.

---

### .draw()

Manually draws the layer stack to the target `<canvas>`. Specially useful to update the graphics when the engine `autoStart` option was set to `false` or the `stop()` method has been called.

**Parameters**: _none_

**Return value:** _none_

---

### .start()

Starts the rendering loop.

**Parameters**: _none_

**Return value:** _none_

---

### .stop()

Stops the rendering loop.

**Parameters**: _none_

**Return value:** _none_

---

## Common pitfalls

- The `<canvas>` element may easily become "tainted" by CORS. That should not be a problem for basic layer rendering, but can be a challenge if you need to do some advanced image processing. To avoid that, you could use some of the solutions [shown in MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image) or use base64 encoded images.
- If you need support for older browsers, you may need polyfills for some of the javascript features used by RushJS, like `requestanimationframe` and `performance.now()`. Check out these gists by [Paul Irish](http://twitter.com/paul_irish):
- [requestAnimationFrame polyfill](https://gist.github.com/paulirish/1579671)
- [performance.now() polyfill](https://gist.github.com/paulirish/5438650)

---

## Plans for future releases

In future releases, we plan to add some new features, like:

- Updated docs
- 2D transforms for layers (scaling and rotation)
- Add `onTick` support for layers

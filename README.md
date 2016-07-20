# RushJS
The **RushJS** library is a super easy to use rendering engine for the HTML5 `<canvas>` element. It implements layer support with a rendering loop in a super straightforward package. Great for games, interactive media or just drawing some images to the canvas.

##Structure
RushJS is based on two main "classes": the **RushLayer** and the **RushEngine**. They work together to create a sensible approach to working with canvas.

**RushLayer** takes a source DOM element to be drawn in canvas and gives you some display controls, like opacity and position. The source can be both an `<img>` element or another `<canvas>` element, which may not need to be onscreen.

**RushEngine** handles the layer stack, renders the layers and runs a rendering loop that offers callbacks both before and after the drawing process.

##Getting started
A basic RushJS setup is as simple as:

    // An image layer, using a selector to pick the source
    var myLayer = new RushLayer({ source: '.my-image' });

    // The actual engine
    var myEngine = new RushEngine({
        target: '.my-canvas',
        layers: [ myLayer ]
    });

This will start the engine with the layer being drawn at the top left of the target canvas.

We could create an offscreen canvas:

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

And then add it to our engine:

    // Creates the new layer
    var canvasLayer = new RushLayer({
        source: canvas,
        x: 300,
        y: 200,
        opacity: 0.5
    });

    // Adds it to the engine
    myEngine.addLayer( canvasLayer );

## RushLayer methods

###Constructor
    RushLayer( options )

**Parameters:** *options* [*object*] A literal object which accepts the following options:

- **source**: [*string* or *object*] A selector indicating an image or canvas element in the current document; or an element object, being either an instance of `HTMLImageElement` or `HTMLCanvasElement`.
*Default: null*

- **label**: [*string*] A textual label for the layer. Used mainly to search for a layer and remove it.
*Default: "" (empty string)*

- **opacity**: [*number*] A decimal number from 0 to 1 representing the layer opacity.
*Default: 1*

- **active**: [*boolean*] A boolean used to turn layer rendering on (`true`) or off (`false`).
*Default: true*

- **x**: [*number*] The horizontal position of the layer, relative to the canvas size.
*Default: 0*

- **y**: [*number*] The vertical position of the layer, relative to the canvas size.
*Default: 0*

### .source( [element] )
Gets or sets the source element of the layer. If the "element" parameter is provided, updates the source.

**Parameters**: *element* [*string* or *object*] A selector indicating an image or canvas element in the current document; or an element object, being either an instance of `HTMLImageElement` or `HTMLCanvasElement`.

**Return value:** the source DOM element object of the layer. If an invalid "element" parameter is provided, returns `false`.


### .label( [label] )
Gets or sets a label for the layer. If an string is provided as the "label" parameter, updates the label.

**Parameters**: *label* [*string*] A textual label for the layer. Used mainly to search for a layer and remove it.

**Return value:** the layer's label string. If an invalid parameter is provided, returns `false`.


### .opacity( [opacity] )
Gets or sets the opacity of the layer. If the "opacity" parameter is provided, updates the opacity.

**Parameters**: *opacity* [*number*] A decimal number from 0 to 1 representing the layer opacity.

**Return value:** a decimal number from 0 to 1. If an invalid parameter is provided, returns `false`.


### .active( [active] )
Gets or sets the rendering control of the layer. If the "active" parameter is provided, updates the control.

**Parameters**: *active* [*boolean*] A boolean used to turn layer rendering on (`true`) or off (`false`).

**Return value:** a boolean representing rendering control of the layer.


### .position( [x, y] )
Gets or sets the position of the layer. If **both "x" and "y"** parameters are provided, updates the position.

**Parameters**: *x* and *y* [*number*] Numbers representing the the horizontal (x) and vertical (y) position of the layer, relative to the canvas size.

**Return value:** a literal object containing the x and y positions of the layer.


## RushEngine methods
### Constructor
    RushEngine( options )

**Default values:**
- *target*: null

- *stepStart*: null

- *stepEnd*: null

- *layers*: null

- *autoStart*: true


#### .target( target )**
#### .setCanvasSize(width,height)**
#### .resetLayers( layers )**
#### .addLayer( layer )**
#### .removeLayer( layer )**
#### .draw()**
#### .start()**
#### .step(now)**
#### .stop()**
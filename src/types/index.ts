export type LAYER = {
  /**
   * A boolean for enabling/disabling the layer
   */
  isActive?: boolean;
  /**
   * A number from 0 to 1 representing the opacity of the layer
   */
  opacity?: number;
  /**
   * The X position of the layer
   */
  posX?: number;
  /**
   * The Y position of the layer
   */
  posY?: number;
  /**
   * A function that is called before the each rendering cycle
   */
  onStep?: ((params: RENDER_PARAMS) => void) | null;
  /**
   * imageSrc has highher precedence than source
   */
  imageSrc?: string;
  source?: string;
};

export type ENGINE = {
  /**
   * The target <canvas> element for the engine to be rendered on. It should be a selector string or the HTMLCanvasElement dom reference
   */
  target?: string;
  /**
   * An array of `Layer` instances to be rendered. The last item in the array is rendered on top
   */
  layers?: LAYER[];
  /**
   * A boolean indicating if the target [canvas' width and height](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#Attributes) to the element's display size
   */
  autoResize?: boolean;
  /**
   * Start engine's refresh cycle as soon as layers are ready
   */
  autoStart?: boolean;
  /**
   * A function that is called before the each rendering cycle
   */
  onStep?: ((params: RENDER_PARAMS) => void) | null;
};

export type RENDER_PARAMS = {
  /**
   * A high-resolution timestamp since the beginning of the application
   */
  now: number;
  /**
   * The difference (in milliseconds) since the last refresh cycle
   */
  offset: number;
  /**
   * The width of the target canvas. Only available if the target `<canvas>` is set
   */
  width: number;
  /**
   * The height of the target canvas. Only available if the target `<canvas>` is set
   */
  height: number;
};

export type IMAGE_DIMENSION = {
  naturalWidth: number;
  naturalHeight: number;
};

export type CANVAS_DIMENSION = {
  width: number;
  height: number;
};

import { IMAGE_DIMENSION, CANVAS_DIMENSION } from '../types';

const getImageDimensions = ({ naturalWidth, naturalHeight }: IMAGE_DIMENSION) => ({
  width: naturalWidth,
  height: naturalHeight,
});

const getCanvasDimensions = ({ width, height }: CANVAS_DIMENSION) => ({
  width,
  height,
});

export const getElementInfo = (element: HTMLElement) => ({
  element,
  ...(element instanceof HTMLImageElement && getImageDimensions(element)),
  ...(element instanceof HTMLCanvasElement && getCanvasDimensions(element)),
});

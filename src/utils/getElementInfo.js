const getImageDimensions = ({ naturalWidth, naturalHeight }) => ({
  width: naturalWidth,
  height: naturalHeight,
});

const getCanvasDimensions = ({ width, height }) => ({ width, height });

const getElementInfo = element => ({
  element,
  ...(element instanceof HTMLImageElement && getImageDimensions(element)),
  ...(element instanceof HTMLCanvasElement && getCanvasDimensions(element)),
});

export default getElementInfo;

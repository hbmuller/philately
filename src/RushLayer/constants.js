export const DEFAULT_VALUES = {
  active: true,
  label: "",
  opacity: 1,
  position: { x: 0, y: 0 }
};

export const VALID_SOURCE_TYPES = [HTMLImageElement, HTMLCanvasElement];

export const ERROR_INVALID_SOURCE =
  'The "source" value must be a canvas or image element or a string selector to one of them.';
export const ERROR_INVALID_LABEL = 'The "label" value must be a string.';
export const ERROR_INVALID_OPACITY = 'The "opacity" value must be a number.';

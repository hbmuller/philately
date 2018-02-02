export const DEFAULT_VALUES = {
  layers: [],
  autoStart: true,
};

export const VALID_TARGET_TYPES = [HTMLCanvasElement];
export const ERROR_INVALID_TARGET = 'The engine needs a canvas target, even if it is not onscreen.';
export const ERROR_INVALID_LAYER = 'The "layer" parameter must be a RushLayer instance.';
export const ERROR_LAYER_NOT_FOUND = 'Layer not found';

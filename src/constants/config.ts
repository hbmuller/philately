import { ENGINE, LAYER } from '../types';

export const DEFAULT_ENGINE_OPTIONS: ENGINE = {
  layers: [],
  onStep: null,
  autoStart: false,
  autoResize: true,
};

export const DEFAULT_LAYER_OPTIONS: LAYER = {
  isActive: true,
  opacity: 1,
  posX: 0,
  posY: 0,
  onStep: null,
};

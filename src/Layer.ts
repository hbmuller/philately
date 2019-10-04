import isNumber from 'lodash/isNumber';
import isFunction from 'lodash/isFunction';
import {
  DEFAULT_LAYER_OPTIONS,
  VALID_SOURCE_TYPES,
  ERROR_INVALID_SOURCE,
  ERROR_INVALID_ONSTEP_CALLBACK,
} from './constants';
import { createSource, getAsyncElement } from './utils';
import { LAYER, RENDER_PARAMS } from './types';

class Layer {
  private readonly config = {
    ...DEFAULT_LAYER_OPTIONS,
    isActive: false,
    isReady: false,
    sourcePromise: null,
    source: null,
    size: 0,
  };

  _posX: number | undefined;
  _posY: number | undefined;
  _opacity: number | undefined;
  _onStep: ((params: RENDER_PARAMS) => void) | null | undefined;

  constructor(options: LAYER) {
    const { posX, posY, opacity, onStep, isActive, imageSrc, source } = {
      ...DEFAULT_LAYER_OPTIONS,
      ...options,
    };

    this._posX = posX;
    this._posY = posY;
    this._opacity = opacity;
    this._onStep = onStep;

    // TODO : add setSource function
  }

  get sourcePromise() {
    return this.config.sourcePromise;
  }

  get source() {
    return this.config.source;
  }

  get size() {
    return this.config.size;
  }

  get posX() {
    return this.config.posX;
  }

  set posX(value) {
    if (isNumber(value)) this.config.posX = value;
  }

  get posY() {
    return this.config.posY;
  }

  set posY(value) {
    if (isNumber(value)) this.config.posY = value;
  }

  get opacity() {
    return this.config.opacity;
  }

  set opacity(opacity) {
    if (isNumber(opacity)) this.config.opacity = Math.max(0, Math.min(1, opacity));
  }

  get onStep() {
    return this.config.onStep;
  }

  set onStep(handler) {
    if (handler && isFunction(handler))
      this.config.onStep = handler || DEFAULT_LAYER_OPTIONS.onStep;
  }

  get isActive() {
    return this.config.isActive;
  }

  set isActive(isActive) {
    if (this.config.isReady) this.config.isActive = !!isActive;
  }

  toggle() {
    this.isActive = !this.isActive;

    return this.isActive;
  }
}

export default Layer;

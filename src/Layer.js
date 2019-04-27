import isNumber from 'lodash/isNumber';
import isFunction from 'lodash/isFunction';
import {
  DEFAULT_LAYER_OPTIONS,
  VALID_SOURCE_TYPES,
  ERROR_INVALID_SOURCE,
  ERROR_INVALID_ONSTEP_CALLBACK,
} from './constants';
import { createSource, getAsyncElement } from './utils';

class Layer {
  #config = {
    ...DEFAULT_LAYER_OPTIONS,
    isActive: false,
    isReady: false,
  };

  constructor(options) {
    const { posX, posY, opacity, onStep, isActive, imageSrc, source } = {
      ...DEFAULT_LAYER_OPTIONS,
      ...options,
    };

    this.posX = posX;
    this.posY = posY;
    this.opacity = opacity;
    this.onStep = onStep;

    if (imageSrc) {
      this.#setSource(createSource(imageSrc), isActive);
    } else if (source) {
      this.#setSource(getAsyncElement(source, VALID_SOURCE_TYPES), isActive);
    }
  }

  #setSource = (sourcePromise, isActive) => {
    this.#config.sourcePromise = sourcePromise
      .then(({ element, ...size }) => {
        this.#config.source = element;
        this.#config.size = size;
        this.#config.isActive = isActive;
        this.#config.isReady = true;

        return { element, ...size };
      })
      .catch(() => console.error(ERROR_INVALID_SOURCE));
  };

  get sourcePromise() {
    return this.#config.sourcePromise;
  }

  get source() {
    return this.#config.source;
  }

  get size() {
    return this.#config.size;
  }

  get posX() {
    return this.#config.posX;
  }

  set posX(value) {
    if (isNumber(value)) this.#config.posX = value;
  }

  get posY() {
    return this.#config.posY;
  }

  set posY(value) {
    if (isNumber(value)) this.#config.posY = value;
  }

  get opacity() {
    return this.#config.opacity;
  }

  set opacity(opacity) {
    if (isNumber(opacity)) this.#config.opacity = Math.max(0, Math.min(1, opacity));
  }

  get onStep() {
    return this.#config.onStep;
  }

  set onStep(handler) {
    if (handler && !isFunction(handler)) return console.error(ERROR_INVALID_ONSTEP_CALLBACK);

    this.#config.onStep = handler || DEFAULT_LAYER_OPTIONS.onStep;
  }

  get isActive() {
    return this.#config.isActive;
  }

  set isActive(isActive) {
    if (this.#config.isReady) this.#config.isActive = !!isActive;
  }

  toggle() {
    this.isActive = !this.isActive;

    return this.isActive;
  }
}

export default Layer;

import isNumber from 'lodash/isNumber';
import { DEFAULT_LAYER_CONFIG, VALID_SOURCE_TYPES, ERROR_INVALID_SOURCE } from './constants';
import { createSource, getAsyncElement } from './utils';

class Layer {
  #config = {
    ...DEFAULT_LAYER_CONFIG,
    isActive: false,
  };

  constructor(config) {
    const { posX, posY, opacity, isActive, imageSrc, source } = {
      ...DEFAULT_LAYER_CONFIG,
      ...config,
    };

    this.posX = posX;
    this.posY = posY;
    this.opacity = opacity;

    if (imageSrc) {
      this.#setSource(createSource(imageSrc), isActive);
    } else if (source) {
      this.#setSource(getAsyncElement(source, VALID_SOURCE_TYPES), isActive);
    }
  }

  #setSource = (sourcePromise, isActive = DEFAULT_LAYER_CONFIG.isActive) => {
    this.#config.sourcePromise = sourcePromise
      .then(({ element, ...size }) => {
        this.#config.source = element;
        this.#config.size = size;
        this.#config.isActive = isActive;

        return element;
      })
      .catch(() => new Error(ERROR_INVALID_SOURCE));
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

  get isActive() {
    return this.#config.isActive;
  }

  set isActive(isActive) {
    this.#config.isActive = !!isActive;
  }

  toggle() {
    this.isActive = !this.isActive;

    return this.isActive;
  }
}

export default Layer;

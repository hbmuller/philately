import isNumber from 'lodash/isNumber';
import { DEFAULT_LAYER_CONFIG, VALID_SOURCE_TYPES, ERROR_INVALID_SOURCE } from './constants';
import { createSource, getAsyncElement } from './utils';

class Layer {
  _config = {
    position: { ...DEFAULT_LAYER_CONFIG.position },
    isActive: false,
  };

  constructor(config) {
    const { imageSrc, source, opacity, isActive, x, y } = { ...DEFAULT_LAYER_CONFIG, ...config };

    this.position = { x, y };
    this.opacity = opacity;

    if (imageSrc) {
      this.setSource(createSource(imageSrc), isActive);
    } else if (source) {
      this.setSource(getAsyncElement(source, VALID_SOURCE_TYPES), isActive);
    }
  }

  setSource(sourcePromise, isActive = DEFAULT_LAYER_CONFIG.isActive) {
    this._config.sourcePromise = sourcePromise
      .then(({ element, ...size }) => {
        this._config.source = element;
        this._config.size = size;
        this._config.isActive = isActive;

        return element;
      })
      .catch(() => new Error(ERROR_INVALID_SOURCE));
  }

  get sourcePromise() {
    return this._config.sourcePromise;
  }

  get source() {
    return this._config.source;
  }

  get isActive() {
    return this._config.isActive;
  }

  set isActive(isActive) {
    this._config.isActive = !!isActive;
  }

  toggle() {
    this.isActive = !this.isActive;

    return this.isActive;
  }

  get size() {
    return this._config.size;
  }

  get position() {
    return { ...this._config.position };
  }

  set position({ x, y }) {
    if (isNumber(x)) this._config.position.x = x;
    if (isNumber(y)) this._config.position.y = y;

    return this.position;
  }

  get opacity() {
    return this._config.opacity;
  }

  set opacity(opacity) {
    if (isNumber(opacity)) this._config.opacity = Math.max(0, Math.min(1, opacity));

    return this.opacity;
  }
}

export default Layer;

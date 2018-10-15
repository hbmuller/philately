import { isNumber } from 'lodash';
import { DEFAULT_LAYER_CONFIG, VALID_SOURCE_TYPES, ERROR_INVALID_SOURCE } from './constants';
import { createSource, getAsyncElement } from './utils';

class RushLayer {
  position = { ...DEFAULT_LAYER_CONFIG.position };

  constructor(config) {
    const { imageSrc, source, opacity, isActive, x, y } = { ...DEFAULT_LAYER_CONFIG, ...config };

    this.setPosition({ x, y });
    this.setOpacity(opacity);
    this.setActive(false);

    if (imageSrc) {
      this.setAsyncSource(createSource(imageSrc), isActive);
    } else if (source) {
      this.setAsyncSource(getAsyncElement(source, VALID_SOURCE_TYPES), isActive);
    }
  }

  setAsyncSource(sourcePromise, isActive) {
    return sourcePromise
      .then(({ element, ...size }) => {
        this.source = element;
        this.size = size;
        this.setActive(isActive);

        return element;
      })
      .catch(() => new Error(ERROR_INVALID_SOURCE));
  }

  getActive() {
    return this.isActive;
  }

  setActive(isActive = true) {
    this.isActive = !!isActive;

    return this.isActive;
  }

  toggleActive() {
    this.isActive = !this.isActive;

    return this.isActive;
  }

  getPosition() {
    return this.position;
  }

  getSize() {
    return this.size;
  }

  setPosition({ x, y }) {
    if (isNumber(x)) this.position.x = x;
    if (isNumber(y)) this.position.y = y;

    return this.position;
  }

  getOpacity() {
    return this.opacity;
  }

  setOpacity(opacity) {
    if (isNumber(opacity)) this.opacity = Math.max(0, Math.min(1, opacity));

    return this.opacity;
  }
}

export default RushLayer;

import { isNumber } from 'lodash';
import { DEFAULT_LAYER_CONFIG, ERROR_INVALID_SOURCE } from './constants';
import { getSourceElement } from './utils';

class RushLayer {
  constructor(config) {
    const { source, opacity, isActive, x, y } = { ...DEFAULT_LAYER_CONFIG, ...config };

    this.setSource(source);

    if (this.source) {
      this.setActive(isActive);
      this.setPosition({ x, y });
      this.setOpacity(opacity);
    }
  }

  setSource(source) {
    const sourceElement = getSourceElement(source);

    if (!sourceElement) {
      this.setActive(false);
      console.error(ERROR_INVALID_SOURCE);

      return null;
    }

    this.source = sourceElement;

    return this.source;
  }

  getActive = () => this.isActive;

  setActive = (isActive = true) => {
    this.isActive = !!isActive;

    return this.isActive;
  };

  toggleActive = () => {
    this.isActive = !this.isActive;

    return this.isActive;
  };

  getPosition = () => this.position;

  setPosition = ({ x, y }) => {
    if (isNumber(x)) this.position.x = x;
    if (isNumber(y)) this.position.y = y;

    return this.position;
  };

  getOpacity = () => this.opacity;

  setOpacity = opacity => {
    if (isNumber(opacity)) this.opacity = Math.max(0, Math.min(1, opacity));

    return this.opacity;
  };
}

export default RushLayer;

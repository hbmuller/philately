import { isUndefined, isNumber } from 'lodash';
import {
  DEFAULT_LAYER_CONFIG,
  VALID_SOURCE_TYPES,
  ERROR_INVALID_SOURCE,
  ERROR_INVALID_OPACITY,
} from './constants';
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
      return console.error(ERROR_INVALID_SOURCE);
    }

    return (this.source = sourceElement);
  }

  getActive = () => this.isActive;

  setActive = (isActive = true) => (this.isActive = !!isActive);

  toggleActive = () => (this.isActive = !this.isActive);

  getPosition = () => this.position;

  setPosition = ({ x, y }) => {
    if (isNumber(x)) this.position.x = x;
    if (isNumber(y)) this.position.y = y;

    return this.position;
  };

  getOpacity = () => this.opacity;

  setOpacity = opacity =>
    (this.opacity = isNumber(opacity) ? Math.max(0, Math.min(1, opacity)) : this.opacity);
}

export default RushLayer;

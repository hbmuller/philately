import { isUndefined, isNumber, isString } from "lodash";
import {
  ERROR_INVALID_SOURCE,
  ERROR_INVALID_LABEL,
  ERROR_INVALID_OPACITY
} from "./constants/messages.js";
import { LAYER_DEFAULT_VALUES } from "./constants/layer.js";

const getLayerSource = source => {
  const srcElement = isString(source) ? document.querySelector(source) : source;
  const isValidSource =
    srcElement &&
    (srcElement instanceof HTMLImageElement ||
      srcElement instanceof HTMLCanvasElement);

  return isValidSource ? srcElement : null;
};

class RushLayer {
  constructor(source, { label, opacity, isActive, x, y }) {
    const srcElement = getLayerSource(source);

    if (!srcElement) {
      this.isActive = false;
      return console.error(ERROR_INVALID_SOURCE);
    }

    this.toggleActive(isActive);
    this.setPosition({ x, y });
    this.setLabel(label);
    this.setOpacity(opacity);
  }

  toggleActive(isActive) {
    if (isUndefined(isActive)) return this.isActive != this.isActive;

    return (this.isActive = !!isActive);
  }

  getPosition() {
    return this.position;
  }

  setPosition({ x, y }) {
    if (!this.position) this.position = LAYER_DEFAULT_VALUES.position;
    if (isNumber(x)) this.position.x = x;
    if (isNumber(y)) this.position.y = y;

    return this.position;
  }

  getLabel() {
    return this.label;
  }

  setLabel(label) {
    if (!isString(label)) {
      console.error(ERROR_INVALID_LABEL);
      return this.label;
    }

    return (this.label = label);
  }

  getOpacity() {
    return this.opacity;
  }

  setOpacity(opacity) {
    if (!isNumber(opacity)) {
      console.error(ERROR_INVALID_OPACITY);
      return this.opacity;
    }

    return (this.opacity = Math.max(0, Math.min(1, opacity)));
  }
}

export default RushLayer;

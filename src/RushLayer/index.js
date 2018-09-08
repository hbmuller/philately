import { isUndefined, isNumber } from "lodash";
import {
  DEFAULT_VALUES,
  VALID_SOURCE_TYPES,
  ERROR_INVALID_SOURCE,
  ERROR_INVALID_OPACITY
} from "./constants";
import { getElement } from "../utils";

class RushLayer {
  constructor(source, config) {
    const { opacity, isActive, x, y } = { ...DEFAULT_VALUES, ...config };
    const srcElement = getElement(source, VALID_SOURCE_TYPES);

    if (!srcElement) {
      this.isActive = false;
      return console.error(ERROR_INVALID_SOURCE);
    }

    this.source = srcElement;
    this.toggleActive(isActive);
    this.setPosition({ x, y });
    this.setOpacity(opacity);
  }

  toggleActive(isActive) {
    if (isUndefined(isActive)) {
      this.isActive = !this.isActive;
    } else {
      this.isActive = !!isActive;
    }

    return this.isActive;
  }

  getPosition() {
    return this.position;
  }

  setPosition({ x, y }) {
    if (!this.position) this.position = DEFAULT_VALUES.position;
    if (isNumber(x)) this.position.x = x;
    if (isNumber(y)) this.position.y = y;

    return this.position;
  }

  getOpacity() {
    return this.opacity;
  }

  setOpacity(opacity) {
    if (!isNumber(opacity)) {
      console.error(ERROR_INVALID_OPACITY);
      return this.opacity;
    }

    this.opacity = Math.max(0, Math.min(1, opacity));

    return this.opacity;
  }
}

export default RushLayer;

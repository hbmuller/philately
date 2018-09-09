import { isUndefined, isNumber } from "lodash";
import {
  DEFAULT_LAYER_CONFIG,
  VALID_SOURCE_TYPES,
  ERROR_INVALID_SOURCE,
  ERROR_INVALID_OPACITY
} from "./constants";
import { getSourceElement } from "./utils";

class RushLayer {
  constructor(config) {
    const { source, opacity, isActive, x, y } = { ...DEFAULT_LAYER_CONFIG, ...config };

    this.setSource(source);

    if (this.source) {
      this.isActive = !!isActive;
      this.setPosition({ x, y });
      this.setOpacity(opacity);
    }
  }

  setSource(source) {
    const sourceElement = getSourceElement(source);

    if (!sourceElement) {
      this.isActive = false;
      return console.error(ERROR_INVALID_SOURCE);
    }

    return (this.source = sourceElement);
  }

  toggle = () => (this.isActive = !this.isActive);

  getPosition = () => this.position;

  setPosition = ({ x, y }) =>
    (this.position = {
      x: isNumber(x) ? x : this.position.x,
      y: isNumber(y) ? x : this.position.y
    });

  getOpacity = () => this.opacity;

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

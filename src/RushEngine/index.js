import { isArray, isFunction, isNumber } from "lodash";
import {
  DEFAULT_VALUES,
  VALID_TARGET_TYPES,
  ERROR_INVALID_TARGET,
  ERROR_LAYER_NOT_FOUND
} from "./constants";
import { getElement } from "../utils";
import RushLayer from "../RushLayer";

class RushEngine {
  constructor(target, config) {
    const targetElement = getElement(target, VALID_TARGET_TYPES);
    const { stepStart, layers, autoStart } = { ...DEFAULT_VALUES, ...config };

    if (!targetElement) return console.error(ERROR_INVALID_TARGET);

    this.target = targetElement;
    this.context = targetElement.getContext("2d");
    this.setCanvasSize();

    this.resetLayers(layers);
    this.setStepStart(stepStart);
    if (autoStart) this.start();
  }

  resetLayers(layers) {
    this.layers = [];

    if (isArray(layers)) layers.forEach(layer => this.addLayer(layer));
  }

  addLayer(layer) {
    if (layer instanceof RushLayer) return this.layers.push(layer);

    console.error(ERROR_INVALID_LAYER);
    return null;
  }

  removeLayer(layer) {
    const index = this.layers.indexOf(layer);
    if (index >= 0) return this.layers.splice(index, i).length;

    console.error(ERROR_LAYER_NOT_FOUND);
    return null;
  }

  setStepStart(stepStart) {
    if (isFunction(stepStart)) this.stepStart = stepStart;
  }

  cleatStepStart() {
    this.stepStart = null;
  }

  start() {
    const now = performance.now();
    this.engineData = {
      start: now,
      lastCall: now,
      running: true
    };

    this.step(now);
  }

  stop() {
    if (this.engineData) this.engineData.running = false;
  }

  setCanvasSize({ width, height } = {}) {
    this.canvasSize = {
      width: isNumber(width) ? width : this.target.clientWidth,
      height: isNumber(height) ? height : this.target.clientHeight
    };

    this.target.width = this.canvasSize.width;
    this.target.height = this.canvasSize.height;
  }

  step(now) {
    const offset = now - this.engineData.lastCall;

    if (this.stepStart) this.stepStart({ offset, now, canvasSize: this.canvasSize });
    if (this.engineData.running) {
      this.draw();
      requestAnimationFrame(now => this.step(now));
      this.engineData.lastCall = now;
    }
  }

  draw() {
    const { width, height } = this.canvasSize;
    this.context.clearRect(0, 0, width, height);

    this.layers.forEach(layer => {
      const { isActive, opacity, source, position } = layer;

      if (layer.isActive && layer.opacity) {
        this.context.globalAlpha = opacity;
        this.context.drawImage(source, position.x, position.y);
      }
    });

    this.context.globalAlpha = 1;
  }
}

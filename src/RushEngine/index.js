import { isArray, isFunction, isNumber } from 'lodash';
import {
  DEFAULT_VALUES,
  ERROR_INVALID_TARGET,
  ERROR_INVALID_LAYER,
  ERROR_LAYER_NOT_FOUND,
} from './constants';
import { getTargetElement } from '../utils';
import RushLayer from '../RushLayer';

class RushEngine {
  constructor(target, config) {
    const { stepStart, layers, autoStart } = { ...DEFAULT_VALUES, ...config };


    this.resetLayers(layers);
    this.setStepStart(stepStart);
    if (autoStart) this.start();
  }

  setTarget(target) {
    const targetElement = getTargetElement(target);
    if (!targetElement) return console.error(ERROR_INVALID_TARGET);

    this.target = targetElement;
    this.context = targetElement.getContext('2d');
    this.setCanvasSize();

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
    if (index >= 0) return this.layers.splice(index, 1).length;

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
      running: true,
    };

    this.step(now);
  }

  stop() {
    if (this.engineData) this.engineData.running = false;
  }

  setCanvasSize({ width, height } = {}) {
    this.canvasSize = {
      width: isNumber(width) ? width : this.target.clientWidth,
      height: isNumber(height) ? height : this.target.clientHeight,
    };

    this.target.width = this.canvasSize.width;
    this.target.height = this.canvasSize.height;
  }

  step(now) {
    const offset = now - this.engineData.lastCall;

    if (this.stepStart) this.stepStart({ offset, now, canvasSize: this.canvasSize });
    if (this.engineData.running) {
      this.draw();
      requestAnimationFrame(timestamp => this.step(timestamp));
      this.engineData.lastCall = now;
    }
  }

  draw() {
    const { width, height } = this.canvasSize;
    this.context.clearRect(0, 0, width, height);

    this.layers.forEach((layer) => {
      if (layer.isActive && layer.opacity) {
        this.context.globalAlpha = layer.opacity;
        this.context.drawImage(layer.source, layer.position.x, layer.position.y);
      }
    });

    this.context.globalAlpha = 1;
  }
}

export default RushEngine;

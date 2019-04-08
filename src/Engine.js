import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import {
  DEFAULT_ENGINE_CONFIG,
  ERROR_INVALID_TARGET,
  ERROR_INVALID_LAYER,
  ERROR_LAYER_NOT_FOUND,
  ERROR_INVALID_ONTICK_CALLBACK,
  ERROR_INVALID_LAYER_ARRAY,
  VALID_TARGET_TYPES,
} from './constants';

import { getElement } from './utils';
import Layer from './Layer';

class Engine {
  constructor(config) {
    const { target, layers, onTick, autoStart } = { ...DEFAULT_ENGINE_CONFIG, ...config };

    this.setTarget(target);
    this.setLayers(layers);
    this.setOnTick(onTick);

    if (this.target && this.layers && this.layers.length) {
      Promise.all(this.layers.map(layer => layer.sourcePromise)).then(() => {
        if (autoStart) return this.start();

        this.draw();
      });
    }
  }

  setTarget(target) {
    const { element } = getElement(target, VALID_TARGET_TYPES);

    if (!element) return console.error(ERROR_INVALID_TARGET);

    this.target = element;
    this.context = element.getContext('2d');
    this.setCanvasSize();
  }

  setLayers(layers) {
    if (!isArray(layers)) return console.error(ERROR_INVALID_LAYER_ARRAY);

    this.layers = [];
    layers.forEach(layer => this.addLayer(layer));
  }

  addLayer(layer) {
    if (!layer instanceof Layer) return console.warn(ERROR_INVALID_LAYER);

    this.layers = [...this.layers, layer];
  }

  removeLayer(layer) {
    const index = this.layers.indexOf(layer);
    if (index < 0) return console.warn(ERROR_LAYER_NOT_FOUND);

    this.layers = [...this.layers.slice(0, index), ...this.layers.slice(index + 1)];
  }

  setOnTick(onTick) {
    if (!isFunction(onTick)) return console.error(ERROR_INVALID_ONTICK_CALLBACK);

    this.onTick = onTick;
  }

  clearOnTick() {
    this.onTick = null;
  }

  start() {
    const start = performance.now();

    this.runData = {
      start,
      lastCall: start,
      running: true,
    };

    this.step(start);
  }

  stop() {
    if (this.runData) this.runData.running = false;
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
    if (!this.runData.running) return;

    const offset = now - this.runData.lastCall;

    if (this.onTick) this.onTick({ offset, now, canvasSize: this.canvasSize });

    this.draw();
    this.runData.lastCall = now;
    requestAnimationFrame(timestamp => this.step(timestamp));
  }

  draw() {
    this.context.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);

    this.layers.forEach(layer => {
      if (layer.isActive && layer.opacity) {
        console.log(layer);

        this.context.globalAlpha = layer.opacity;
        this.context.drawImage(layer.source, layer.position.x, layer.position.y);
      }
    });
  }
}

export default Engine;

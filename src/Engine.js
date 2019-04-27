import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import {
  DEFAULT_ENGINE_OPTIONS,
  ERROR_INVALID_TARGET,
  ERROR_INVALID_LAYER,
  ERROR_LAYER_NOT_FOUND,
  ERROR_INVALID_ONSTEP_CALLBACK,
  ERROR_INVALID_LAYER_ARRAY,
  VALID_TARGET_TYPES,
} from './constants';

import { getElement } from './utils';
import Layer from './Layer';

class Engine {
  #config = {
    target: null,
    context: null,
    isRunning: false,
    initialTime: null,
    lastCallTime: null,
  };

  constructor(options) {
    const { target, layers, onStep, autoStart, autoResize } = {
      ...DEFAULT_ENGINE_OPTIONS,
      ...options,
    };

    this.autoResize = autoResize;
    this.layers = layers;
    this.onStep = onStep;
    this.target = target;

    if (this.target && this.layers.length)
      Promise.all(this.layers.map(layer => layer.sourcePromise)).then(() => {
        if (autoStart) return this.start();

        this.draw();
      });
  }

  get target() {
    return this.#config.target;
  }

  set target(selector) {
    if (!selector) return;

    const { element } = getElement(selector, VALID_TARGET_TYPES);

    if (!element) return console.error(ERROR_INVALID_TARGET);

    this.#config.target = element;
    this.#config.context = element.getContext('2d');

    if (this.autoResize) this.#resetTargetSize();
  }

  get layers() {
    return [...this.#config.layers];
  }

  set layers(newLayers) {
    if (!isArray(newLayers)) return console.error(ERROR_INVALID_LAYER_ARRAY);

    this.#config.layers = [];
    newLayers.forEach(layer => this.addLayer(layer));
  }

  addLayer(layer) {
    if (!layer instanceof Layer) return console.warn(ERROR_INVALID_LAYER);

    this.#config.layers = [...this.#config.layers, layer];
  }

  removeLayer(layer) {
    const index = this.layers.indexOf(layer);
    if (index < 0) return console.warn(ERROR_LAYER_NOT_FOUND);

    this.#config.layers = [...this.layers.slice(0, index), ...this.layers.slice(index + 1)];
  }

  #resetTargetSize = () => {
    if (!this.target) return;

    this.target.width = this.target.clientWidth;
    this.target.height = this.target.clientHeight;

    this.draw();
  };

  get autoResize() {
    return this.#config.autoResize;
  }

  set autoResize(value) {
    const autoResize = !!value;

    if (autoResize && !this.autoResize) window.addEventListener('resize', this.#resetTargetSize);
    if (!autoResize && this.autoResize) window.removeEventListener('resize', this.#resetTargetSize);

    this.#config.autoResize = autoResize;
  }

  get onStep() {
    return this.#config.onStep;
  }

  set onStep(handler) {
    if (handler && !isFunction(handler)) return console.error(ERROR_INVALID_ONSTEP_CALLBACK);

    this.#config.onStep = handler || DEFAULT_ENGINE_OPTIONS.onStep;
  }

  get isRunning() {
    return this.#config.isRunning;
  }

  start() {
    const now = performance.now();

    this.#config.isRunning = true;
    this.#config.initialTime = now;
    this.#config.lastCallTime = now;

    this.#step(now);
  }

  stop() {
    this.#config.isRunning = false;
  }

  #step = now => {
    if (!this.isRunning) return;

    const stepParams = {
      now,
      offset: now - this.#config.lastCallTime,
      width: this.target.width,
      height: this.target.height,
    };

    this.layers.forEach(layer => layer.onStep && layer.onStep(stepParams, layer));
    this.onStep && this.onStep(stepParams);

    this.draw();
    this.#config.lastCallTime = now;
    requestAnimationFrame(this.#step);
  };

  draw() {
    if (!this.target || !this.layers) return null;

    const { context } = this.#config;

    context.clearRect(0, 0, this.target.width, this.target.height);

    this.layers.forEach(layer => {
      if (layer.isActive && layer.opacity) {
        context.globalAlpha = layer.opacity;
        context.drawImage(layer.source, layer.posX, layer.posY);
      }
    });
  }
}

export default Engine;

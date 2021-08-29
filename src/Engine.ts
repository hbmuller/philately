import {
  ERROR_INVALID_LAYER,
  ERROR_INVALID_LAYER_ARRAY,
  ERROR_INVALID_ONSTEP_CALLBACK,
  ERROR_INVALID_TARGET,
  ERROR_LAYER_NOT_FOUND,
  VALID_TARGET_TYPES,
} from './constants';

import { Layer } from './Layer';
import { StepHandler } from './types';
import { getElement } from './utils';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';

export type EngineOptions = {
  target?: HTMLCanvasElement;
  layers?: Layer[];
  onStep?: StepHandler;
  autoStart?: boolean;
  autoResize?: boolean;
};

export const DEFAULT_ENGINE_OPTIONS: EngineOptions = {
  layers: [],
  onStep: null,
  autoStart: false,
  autoResize: true,
};

class Engine {
  #config = {
    target: null,
    context: null,
    isRunning: false,
    initialTime: null,
    lastCallTime: null,
  };

  constructor(options: EngineOptions) {
    const { target, layers, onStep, autoStart, autoResize } = {
      ...DEFAULT_ENGINE_OPTIONS,
      ...options,
    };

    this.autoResize = autoResize;
    this.layers = layers;
    this.onStep = onStep;
    this.target = target;

    this.#config.layersPromise.then(() => {
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
    newLayers.forEach((layer) => this.addLayer(layer, false));

    this.#config.layersPromise = Promise.all(this.layers.map(({ sourcePromise }) => sourcePromise));

    if (this.target && !this.isRunning) this.#config.layersPromise.then(this.draw);
  }

  addLayer(layer, shouldDraw = true) {
    if (!layer instanceof Layer) return console.warn(ERROR_INVALID_LAYER);

    this.#config.layers = [...this.#config.layers, layer];

    if (shouldDraw) layer.sourcePromise.then(this.draw);
  }

  removeLayer(layer, shouldDraw = true) {
    const index = this.layers.indexOf(layer);
    if (index < 0) return console.warn(ERROR_LAYER_NOT_FOUND);

    this.#config.layers = [...this.layers.slice(0, index), ...this.layers.slice(index + 1)];

    if (shouldDraw) this.draw();
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

  #step = (now) => {
    if (!this.isRunning) return;

    const stepParams = {
      now,
      offset: now - this.#config.lastCallTime,
      ...(this.target && {
        width: this.target.width,
        height: this.target.height,
      }),
    };

    this.layers.forEach((layer) => layer.onStep && layer.onStep(stepParams, layer));
    this.onStep && this.onStep(stepParams);

    this.draw();
    this.#config.lastCallTime = now;
    requestAnimationFrame(this.#step);
  };

  clear = () =>
    this.#config.context &&
    this.#config.context.clearRect(0, 0, this.target.width, this.target.height);

  draw = () => {
    const { context } = this.#config;

    if (!context) return null;

    this.clear();

    this.layers.forEach((layer) => {
      if (layer.isActive && layer.opacity) {
        this.#config.context.globalAlpha = layer.opacity;
        this.#config.context.drawImage(layer.source, layer.posX, layer.posY);
      }
    });
  };
}

export default Engine;

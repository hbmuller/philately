import {
  ERROR_INVALID_LAYER,
  ERROR_INVALID_LAYER_ARRAY,
  ERROR_INVALID_ONSTEP_CALLBACK,
  ERROR_INVALID_TARGET,
  VALID_TARGET_TYPES,
} from './constants';
import { ElementInfo, StepParams } from './types';

import { Layer } from './Layer';
import { getElement } from './utils';

export type EngineOptions = {
  target?: string | HTMLCanvasElement;
  layers?: Layer[];
  onStep?: (params: StepParams) => void;
  autoStart?: boolean;
  autoResize?: boolean;
};

export const DEFAULT_ENGINE_OPTIONS: EngineOptions = {
  layers: [],
  onStep: null,
  autoStart: false,
  autoResize: true,
};

type EngineState = Omit<EngineOptions, 'autoStart' | 'target'> & {
  target?: HTMLCanvasElement;
  context?: CanvasRenderingContext2D;
  isRunning: boolean;
  initialTime?: number;
  lastCallTime?: number;
  layersPromise?: Promise<ElementInfo[]>;
};

export class Engine {
  #state: EngineState = {
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

    this.#state.layersPromise.then(() => {
      if (autoStart) return this.start();

      this.draw();
    });
  }

  get target(): HTMLCanvasElement {
    return this.#state.target;
  }

  set target(selector: string | HTMLCanvasElement) {
    if (!selector) return;

    const { element } = getElement(selector, VALID_TARGET_TYPES);

    if (!element) throw new Error(ERROR_INVALID_TARGET);

    this.#state.target = element as HTMLCanvasElement;
    this.#state.context = this.#state.target.getContext('2d');

    if (this.autoResize) this.#resetTargetSize();
  }

  get layers() {
    return [...this.#state.layers];
  }

  set layers(newLayers) {
    if (!Array.isArray(newLayers)) throw new Error(ERROR_INVALID_LAYER_ARRAY);

    this.#state.layers = [];
    newLayers.forEach((layer) => this.addLayer(layer, false));

    this.#state.layersPromise = Promise.all(this.layers.map(({ sourcePromise }) => sourcePromise));

    if (this.target && !this.isRunning) this.#state.layersPromise.then(this.draw);
  }

  addLayer(layer: Layer, shouldDraw = true) {
    if (layer instanceof Layer) {
      this.#state.layers = [...this.layers, layer];

      if (shouldDraw) layer.sourcePromise.then(this.draw);
    } else {
      console.warn(ERROR_INVALID_LAYER);
    }
  }

  removeLayer(layer: Layer, shouldDraw = true) {
    this.#state.layers = this.layers.filter((item) => !Object.is(item, layer));

    if (shouldDraw) this.draw();
  }

  #resetTargetSize = () => {
    if (!this.target) return;

    this.target.width = this.target.clientWidth;
    this.target.height = this.target.clientHeight;

    this.draw();
  };

  get autoResize() {
    return this.#state.autoResize;
  }

  set autoResize(value) {
    const autoResize = !!value;

    if (autoResize && !this.autoResize) window.addEventListener('resize', this.#resetTargetSize);
    if (!autoResize && this.autoResize) window.removeEventListener('resize', this.#resetTargetSize);

    this.#state.autoResize = autoResize;
  }

  get onStep() {
    return this.#state.onStep;
  }

  set onStep(handler) {
    if (handler && typeof handler !== 'function') throw new Error(ERROR_INVALID_ONSTEP_CALLBACK);

    this.#state.onStep = handler;
  }

  get isRunning() {
    return this.#state.isRunning;
  }

  start() {
    const now = performance.now();

    this.#state.isRunning = true;
    this.#state.initialTime = now;
    this.#state.lastCallTime = now;

    this.#step(now);
  }

  stop() {
    this.#state.isRunning = false;
  }

  #step = (now: number) => {
    if (!this.isRunning) return;

    const stepParams = {
      now,
      offset: now - this.#state.lastCallTime,
      ...(this.target && {
        width: this.target.width,
        height: this.target.height,
      }),
    };

    this.layers.forEach((layer) => layer.onStep && layer.onStep(stepParams, layer));
    this.onStep && this.onStep(stepParams);

    this.draw();
    this.#state.lastCallTime = now;
    requestAnimationFrame(this.#step);
  };

  clear = () =>
    this.#state.context &&
    this.#state.context.clearRect(0, 0, this.target.width, this.target.height);

  draw = (): void => {
    const { context } = this.#state;

    if (!context) return null;

    this.clear();

    this.layers.forEach((layer) => {
      if (layer.isActive && layer.opacity) {
        this.#state.context.globalAlpha = layer.opacity;
        this.#state.context.drawImage(layer.source, layer.posX, layer.posY);
      }
    });
  };
}

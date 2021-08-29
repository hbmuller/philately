import { ERROR_INVALID_SOURCE, VALID_SOURCE_TYPES } from './constants';
import type { ElementType, SourceDimensions, SourcePromise, StepHandler } from './types';
import { createSource, getAsyncElement } from './utils';

export type LayerOptions = {
  source?: string | ElementType;
  imageSrc?: string;
  posX?: number;
  posY?: number;
  opacity?: number;
  isActive?: boolean;
  onStep?: StepHandler;
};

export const DEFAULT_LAYER_OPTIONS: LayerOptions = {
  isActive: true,
  opacity: 1,
  posX: 0,
  posY: 0,
  onStep: null,
};

type LayerConfig = Omit<LayerOptions, 'isActive'> & {
  isActive: boolean;
  isReady: boolean;
  sourcePromise?: SourcePromise;
  size?: SourceDimensions;
};

export class Layer {
  #config: LayerConfig = {
    ...DEFAULT_LAYER_OPTIONS,
    isActive: false,
    isReady: false,
  };

  constructor(options: LayerOptions) {
    const { posX, posY, opacity, onStep, isActive, imageSrc, source } = {
      ...DEFAULT_LAYER_OPTIONS,
      ...options,
    };

    this.posX = posX;
    this.posY = posY;
    this.opacity = opacity;
    this.onStep = onStep;

    if (imageSrc) {
      this.#setSource(createSource(imageSrc), isActive);
    } else if (source) {
      this.#setSource(getAsyncElement(source, VALID_SOURCE_TYPES), isActive);
    }
  }

  #setSource = (sourcePromise: SourcePromise, isActive?: boolean) => {
    this.#config.sourcePromise = sourcePromise;

    sourcePromise
      .then(({ element, ...size }) => {
        this.#config.source = element;
        this.#config.size = size;
        this.#config.isActive = isActive;
        this.#config.isReady = true;

        return { element, ...size };
      })
      .catch(() => console.error(ERROR_INVALID_SOURCE));
  };

  get sourcePromise() {
    return this.#config.sourcePromise;
  }

  get source() {
    return this.#config.source;
  }

  get size() {
    return this.#config.size;
  }

  get posX() {
    return this.#config.posX;
  }

  set posX(value) {
    if (typeof value === 'number') this.#config.posX = value;
  }

  get posY() {
    return this.#config.posY;
  }

  set posY(value) {
    if (typeof value === 'number') this.#config.posY = value;
  }

  get opacity() {
    return this.#config.opacity;
  }

  set opacity(opacity) {
    if (typeof opacity === 'number') this.#config.opacity = Math.max(0, Math.min(1, opacity));
  }

  get onStep() {
    return this.#config.onStep;
  }

  set onStep(handler) {
    this.#config.onStep = handler;
  }

  get isActive() {
    return this.#config.isActive;
  }

  set isActive(isActive) {
    if (this.#config.isReady) this.#config.isActive = !!isActive;
  }

  toggle() {
    this.isActive = !this.isActive;

    return this.isActive;
  }
}

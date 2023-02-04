import { ERROR_INVALID_SOURCE, VALID_SOURCE_TYPES } from "./constants";
import type {
  ElementType,
  SourceDimensions,
  SourcePromise,
  StepParams,
} from "./types";
import { createSource, getAsyncElement } from "./utils";

export type LayerOptions = {
  source?: string | ElementType;
  imageSrc?: string;
  posX?: number;
  posY?: number;
  opacity?: number;
  isActive?: boolean;
  onStep?: (params: StepParams, layer: Layer) => void;
};

export const DEFAULT_LAYER_OPTIONS: Omit<LayerOptions, "source"> = {
  isActive: true,
  opacity: 1,
  posX: 0,
  posY: 0,
  onStep: null,
};

type LayerState = Omit<LayerOptions, "isActive" | "source"> & {
  source?: ElementType;
  isActive: boolean;
  isReady: boolean;
  sourcePromise?: SourcePromise;
  size?: SourceDimensions;
};

export class Layer {
  #state: LayerState = {
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
    this.#state.sourcePromise = sourcePromise;

    this.#state.sourcePromise
      .then(({ element, ...size }) => {
        this.#state.source = element;
        this.#state.size = size;
        this.#state.isActive = isActive;
        this.#state.isReady = true;

        return { element, ...size };
      })
      .catch(() => console.error(ERROR_INVALID_SOURCE));
  };

  get sourcePromise() {
    return this.#state.sourcePromise;
  }

  get source() {
    return this.#state.source;
  }

  get size() {
    return this.#state.size;
  }

  get posX() {
    return this.#state.posX;
  }

  set posX(value) {
    if (typeof value === "number") this.#state.posX = value;
  }

  get posY() {
    return this.#state.posY;
  }

  set posY(value) {
    if (typeof value === "number") this.#state.posY = value;
  }

  get opacity() {
    return this.#state.opacity;
  }

  set opacity(opacity) {
    if (typeof opacity === "number")
      this.#state.opacity = Math.max(0, Math.min(1, opacity));
  }

  get onStep() {
    return this.#state.onStep;
  }

  set onStep(handler) {
    this.#state.onStep = handler;
  }

  get isActive() {
    return this.#state.isActive;
  }

  set isActive(isActive) {
    if (this.#state.isReady) this.#state.isActive = !!isActive;
  }

  toggle() {
    this.isActive = !this.isActive;

    return this.isActive;
  }
}

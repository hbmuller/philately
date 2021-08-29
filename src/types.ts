export type StepParams = {
  now: number;
  offset: number;
  width?: number;
  height?: number;
};

export type StepHandler = (arg: StepParams) => void;

export type SourceDimensions = {
  width: number;
  height: number;
};

export type ElementType = HTMLCanvasElement | HTMLImageElement;

export type ElementInfo = SourceDimensions & { element: ElementType };

export type SourcePromise = Promise<ElementInfo>;

export type ValidElementTypes = typeof HTMLElement[];

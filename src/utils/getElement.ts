import { ElementType, ValidElementTypes } from '../types';
import { getElementInfo, imageLoader } from '.';

const isValidElement = (element: Element, validTypes: ValidElementTypes) =>
  element && validTypes.some((type) => element instanceof type);

const resolveValidElement = (selector: string | ElementType, validTypes: ValidElementTypes) => {
  const element = typeof selector === 'string' ? document.querySelector(selector) : selector;

  return isValidElement(element, validTypes) ? (element as ElementType) : null;
};

type ResolveParams = Parameters<typeof resolveValidElement>;

export const getElement = (...params: ResolveParams) =>
  getElementInfo(resolveValidElement(...params));

export const getAsyncElement = (...params: ResolveParams) => {
  const element = resolveValidElement(...params);

  if (element instanceof HTMLImageElement) return imageLoader(element);
  if (element instanceof HTMLCanvasElement) return Promise.resolve(getElementInfo(element));

  return Promise.reject();
};

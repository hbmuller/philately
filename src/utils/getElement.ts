import isString from 'lodash/isString';
import { imageLoader, getElementInfo } from '.';

const isValidElement = (element: any, validTypes: any[]) =>
  element && validTypes.some(type => element instanceof type);

const resolveValidElement = (selector: any, validTypes: any[]) => {
  const element = isString(selector) ? document.querySelector(selector) : selector;

  return isValidElement(element, validTypes) ? element : null;
};

export const getElement = (...params: any[]) => getElementInfo(resolveValidElement(...params));

export const getAsyncElement = (...params: any[]) => {
  const element = resolveValidElement(...params);

  if (element instanceof HTMLImageElement) return imageLoader(element);
  if (element instanceof HTMLCanvasElement) return Promise.resolve(getElementInfo(element));

  return Promise.reject();
};

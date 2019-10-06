import isString from 'lodash/isString';
import { imageLoader, getElementInfo } from '.';

const isValidElement = (element, validTypes) =>
  element && validTypes.some(type => element instanceof type);

const resolveValidElement = (selector, validTypes) => {
  const element = isString(selector) ? document.querySelector(selector) : selector;

  return isValidElement(element, validTypes) ? element : null;
};

export const getElement = (...params) => getElementInfo(resolveValidElement(...params));

export const getAsyncElement = (...params) => {
  const element = resolveValidElement(...params);

  if (element instanceof HTMLImageElement) return imageLoader(element);
  else if (element instanceof HTMLCanvasElement) return Promise.resolve(getElementInfo(element));
  else if (element instanceof SVGElement) return createSource(`data:image/svg+xml;utf8,${element.outerHTML}`);

  return Promise.reject();
};

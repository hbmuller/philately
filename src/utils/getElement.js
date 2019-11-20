import isString from 'lodash/isString';
import { imageLoader, getElementInfo, createSource } from '.';

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
  if (element instanceof HTMLCanvasElement) return Promise.resolve(getElementInfo(element));
  if (element instanceof SVGElement){
    //Required as of Latest Chrome, Firefox and Edge
    if (!element.getAttribute('xmlns')) element.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    return createSource('data:image/svg+xml;utf8,' + element.outerHTML.split('#').join('%23'));
  }

  return Promise.reject();
};

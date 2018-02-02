import { isArray, isString } from 'lodash';

export default (target, validTypes) => {
  const element = isString(target) ? document.querySelector(target) : target;
  const noElement = !element || !(element instanceof HTMLElement);
  const isInvalid =
    noElement || (isArray(validTypes) && !validTypes.some(type => element instanceof type));

  if (noElement || isInvalid) return null;

  return element;
};

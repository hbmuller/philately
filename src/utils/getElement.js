import { isArray } from "lodash";

export default (target, validTypes) => {
  const element = isString(target) ? document.querySelector(target) : target;
  const noElementFound = !element || !element instanceof HTMLElement;
  const isInvalidType =
    noElementFound ||
    (isArray(validTypes) && !validTypes.some(type => element instanceof type));

  if (noElementFound || invalidElement) return null;

  return element;
};

import { isArray } from "lodash";
import isValidType from "./isValidType";

export default (target, validTypes) => {
  const element = isString(target) ? document.querySelector(target) : target;
  const noElement = !element || !element instanceof HTMLElement;
  const isInvalidType = noElement || (isArray(validTypes) && !isValidType(element, validTypes));

  if (noElement || invalidElement) return null;

  return element;
};

import { isString } from 'lodash';
import { VALID_TARGET_TYPES, VALID_SOURCE_TYPES } from '../constants';

const isValidType = (element, validTypes) => validTypes.some(type => element instanceof type);

const getElement = (target, validTypes) => {
  const element = isString(target) ? document.querySelector(target) : target;

  return element && isValidType(element, validTypes) ? element : null;
};

export const getTargetElement = element => getElement(element, VALID_TARGET_TYPES);

export const getSourceElement = element => getElement(element, VALID_SOURCE_TYPES);

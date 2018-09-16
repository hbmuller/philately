import { getElementInfo } from '.';

export const imageLoader = element =>
  new Promise((resolve, reject) => {
    const handleComplete = () => resolve(getElementInfo(element));

    if (element.complete) return handleComplete();

    element.addEventListener('load', handleComplete);
    element.addEventListener('error', reject);
  });

export const createSource = src => {
  const element = document.createElement('img');
  element.src = src;

  return imageLoader(element);
};

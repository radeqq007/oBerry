import { ElementWrapper } from '../wrapper/wrapper.js';

/**
 * Select DOM elements using a CSS selector, HTMLElement, NodeList, or an Array of HTMLElements.
 */
export function $(
  selector: string | HTMLElement | NodeList | HTMLElement[]
): ElementWrapper {
  let elements: HTMLElement[] | NodeList;
  if (typeof selector === 'string') {
    elements = document.querySelectorAll(selector);
  } else if (selector instanceof HTMLElement) {
    elements = [selector];
  } else if (selector instanceof NodeList || Array.isArray(selector)) {
    elements = selector;
  } else {
    throw new Error('Invalid selector type');
  }

  return new ElementWrapper(elements);
}

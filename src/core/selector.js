import { ElementWrapper } from './wrapper.js';

/**
 * Select DOM elements using a CSS selector, HTMLElement, NodeList, or an Array of HTMLElements.
 *@param {string|HTMLElement|NodeList} selector - A CSS selector string, a single HTMLElement, a NodeList, or an Array of HTMLElements.
 */
export function $(selector) {
  let elements;
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

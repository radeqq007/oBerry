import { ElementWrapper } from '../wrapper';

/**
 * Select DOM elements using a CSS selector, HTMLElement, NodeList, or an Array of HTMLElements.
 */
export function $(selector: string): ElementWrapper;
export function $(selector: NodeList): ElementWrapper;
export function $(selector: HTMLElement): ElementWrapper;
export function $(selector: HTMLElement[]): ElementWrapper;
export function $(
  selector: string | HTMLElement | NodeList | HTMLElement[]
): ElementWrapper {
  let elements: HTMLElement[] | NodeList;
  if (typeof selector === 'string') {
    // Use getElementById, getElementsByClassName etc. for simple selectors
    // Fallback to .querySelectorAll() for complex or space-seperated selectors
    if (selector.includes(' ')) {
      elements = document.querySelectorAll(selector);
    } else if (selector.startsWith('#')) {
      const el = document.getElementById(selector.slice(1));
      elements = [el as HTMLElement];
    } else if (selector.startsWith('.')) {
      elements = Array.from(
        document.getElementsByClassName(selector.slice(1))
      ) as HTMLElement[];
    } else if (selector.includes('.') || selector.includes('#')) {
      elements = document.querySelectorAll(selector);
    } else {
      elements = Array.from(
        document.getElementsByTagName(selector)
      ) as HTMLElement[];
    }
  } else if (selector instanceof HTMLElement) {
    elements = [selector];
  } else if (selector instanceof NodeList || Array.isArray(selector)) {
    elements = selector;
  } else {
    throw new Error('Invalid selector type');
  }

  return new ElementWrapper(elements);
}

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

class ElementWrapper {
  constructor(elements) {
    this.elements = elements;
  }

  /**
   * Add a class to all elements
   * @param {string} className
   * @returns {ElementWrapper}
   */
  addClass(className) {
    this.elements.forEach(el => el.classList.add(className));
    return this;
  }

  /**
   * Remove a class to all elements
   * @param {string} className
   * @returns {ElementWrapper}
   */
  removeClass(className) {
    this.elements.forEach(el => el.classList.remove(className));
    return this;
  }

  /**
   * Toggle a class on all elements
   * @param {string} className
   * @returns {ElementWrapper}
   */
  toggleClass(className) {
    this.elements.forEach(el => el.classList.toggle(className));
    return this;
  }

  /**
   * Modify the style of all elements
   * @param {Object.<string, string>} styles
   * @returns {ElementWrapper}
   */
  css(styles) {
    this.elements.forEach(el => {
      for (const [key, value] of Object.entries(styles)) {
        el.style[key] = value;
      }
    });
    return this;
  }
}

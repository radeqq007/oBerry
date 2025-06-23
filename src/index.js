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

  /**
   *  Get the array of elements
   * @returns {Array<HTMLElement>}
   */
  getArray() {
    return Array.from(this.elements);
  }

  /**
   * Get the NodeList of elements
   * @returns {NodeList}
   */
  getNodeList() {
    return this.elements instanceof NodeList
      ? this.elements
      : document.querySelectorAll(this.elements);
  }

  #on(event, callback) {
    this.elements.forEach(el => el.addEventListener(event, callback));
    return this;
  }

  /**
   * Attach a click event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onClick(callback) {
    return this.#on('click', callback);
  }

  /**
   * Attach a mouseover event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onMouseOver(callback) {
    return this.#on('mouseover', callback);
  }

  /**
   * Attach a mouseout event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onMouseOut(callback) {
    return this.#on('mouseout', callback);
  }

  /**
   * Attach a change event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onChange(callback) {
    return this.#on('change', callback);
  }

  /**
   * Attach an input event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onInput(callback) {
    return this.#on('input', callback);
  }

  /**
   * Attach a submit event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onSubmit(callback) {
    return this.#on('submit', callback);
  }

  /**
   * Attach a focus event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onFocus(callback) {
    return this.#on('focus', callback);
  }

  /**
   * Attach a blur event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onBlur(callback) {
    return this.#on('blur', callback);
  }

  /**
   * Attach a keydown event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onKeyDown(callback) {
    return this.#on('keydown', callback);
  }

  /**
   * Attach a keyup event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onKeyUp(callback) {
    return this.#on('keyup', callback);
  }

  /**
   * Attach a keypress event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onKeyPress(callback) {
    return this.#on('keypress', callback);
  }

  /**
   * Attach a double-click event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onDblClick(callback) {
    return this.#on('dblclick', callback);
  }

  /**
   * Attach a contextmenu event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onContextMenu(callback) {
    return this.#on('contextmenu', callback);
  }

  /**
   * Attach a scroll event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onScroll(callback) {
    return this.#on('scroll', callback);
  }

  /**
   * Attach a resize event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onResize(callback) {
    return this.#on('resize', callback);
  }

  /**
   * Attach a load event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onLoad(callback) {
    return this.#on('load', callback);
  }

  /**
   * Attach an unload event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onUnload(callback) {
    return this.#on('unload', callback);
  }

  /**
   * Attach a drag event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onDrag(callback) {
    return this.#on('drag', callback);
  }

  /**
   * Attach a drop event listener to all elements
   * @param {Function} callback - The function to call when the event occurs
   * @returns {ElementWrapper}
   */
  onDrop(callback) {
    return this.#on('drop', callback);
  }
}

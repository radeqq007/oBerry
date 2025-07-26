import type { Ref } from '../../types/index';
import { $effect } from '../reactivity';
import { $ } from '../selector';

export class ElementWrapper {
  elements: HTMLElement[];

  constructor(elements: HTMLElement[] | NodeList) {
    // Convert NodeList to Array and filter to only HTMLElements because typescripts yells at you otherwise
    if (elements instanceof NodeList) {
      this.elements = Array.from(elements).filter(
        (node): node is HTMLElement => node.nodeType === Node.ELEMENT_NODE
      ) as HTMLElement[];
    } else {
      this.elements = elements;
    }
  }

  /**
   * Add a class to all elements.
   */
  addClass(className: string): this {
    for (const el of this.elements) el.classList.add(className);
    return this;
  }

  /**
   * Remove a class to all elements.
   */
  removeClass(className: string): this {
    for (const el of this.elements) el.classList.remove(className);
    return this;
  }

  /**
   * Toggle a class on all elements.
   */
  toggleClass(className: string): this {
    for (const el of this.elements) el.classList.toggle(className);
    return this;
  }

  id(): string | undefined;
  id(id: string): this;
  id(id?: string): string | undefined | this {
    if (id === undefined) {
      const el = this.elements[0];
      return el?.id || undefined;
    }

    for (const el of this.elements) {
      el.id = id;
    }

    return this;
  }

  /**
   * Modify the style of all elements.
   */
  css(styles: Partial<CSSStyleDeclaration>): this {
    for (const el of this.elements) Object.assign(el.style, styles);
    return this;
  }

  html(content: string): this;
  html(): string | undefined;
  html(content?: string): this | string | undefined {
    if (content === undefined) {
      return this.elements[0]?.innerHTML;
    }

    for (const el of this.elements) {
      el.innerHTML = content;
    }

    return this;
  }

  text(content: string): this;
  text(): string | undefined;
  text(content?: string): this | string | undefined {
    if (content === undefined) {
      return this.elements[0]?.innerText;
    }

    for (const el of this.elements) {
      el.innerText = content;
    }

    return this;
  }

  /**
   *  Get the array of elements.
   */
  getArray(): HTMLElement[] {
    return Array.from(this.elements);
  }

  value(newValue: string): this;
  value(): string | undefined;
  value(newValue?: string): this | string | undefined {
    const el = this.elements[0];

    if (newValue === undefined) {
      if (!el) return;

      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement
      ) {
        return el.value;
      }

      return;
    }

    if (!el) return this;

    if (
      el instanceof HTMLInputElement ||
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLSelectElement
    ) {
      el.value = newValue;
    }

    return this;
  }

  /**
   * Append elements to all selected elements.
   */
  append(content: string): this;
  append(content: HTMLElement): this;
  append(content: ElementWrapper): this;
  append(content: string | HTMLElement | ElementWrapper): this {
    for (const el of this.elements) {
      if (typeof content === 'string') el.innerHTML += content;
      else if (content instanceof HTMLElement) el.appendChild(content);
      else if (content instanceof ElementWrapper)
        for (const child of content.elements) {
          el.appendChild(child.cloneNode(true));
        }
    }
    return this;
  }

  /**
   * Prepend elements to all selected elements.
   */
  prepend(content: string): this;
  prepend(content: HTMLElement): this;
  prepend(content: ElementWrapper): this;
  prepend(content: string | HTMLElement | ElementWrapper): this {
    for (const el of this.elements) {
      if (typeof content === 'string') el.innerHTML = content + el.innerHTML;
      else if (content instanceof HTMLElement)
        el.insertBefore(content.cloneNode(true), el.firstChild);
      else if (content instanceof ElementWrapper)
        content.elements.forEach((childEl, index) => {
          el.insertBefore(childEl.cloneNode(true), el.children[index] || null);
        });
    }
    return this;
  }

  /**
   * Insert elements after all selected elements.
   */
  after(content: string): this;
  after(content: HTMLElement): this;
  after(content: ElementWrapper): this;
  after(content: string | HTMLElement | ElementWrapper): this {
    for (const el of this.elements) {
      const parent = el.parentNode;
      if (!parent) continue;

      if (typeof content === 'string') {
        const temp = document.createElement('div');
        temp.innerHTML = content;

        while (temp.firstChild) {
          parent.insertBefore(temp.firstChild, el.nextSibling);
        }
      } else if (content instanceof HTMLElement) {
        parent.insertBefore(content.cloneNode(true), el.nextSibling);
      } else if (content instanceof ElementWrapper) {
        for (const childEl of content.elements) {
          parent.insertBefore(childEl.cloneNode(true), el.nextSibling);
        }
      }
    }
    return this;
  }

  /**
   * Insert elements before all selected elements.
   */
  before(content: string): this;
  before(content: HTMLElement): this;
  before(content: ElementWrapper): this;
  before(content: string | HTMLElement | ElementWrapper): this {
    for (const el of this.elements) {
      const parent = el.parentNode;
      if (!parent) continue;

      if (typeof content === 'string') {
        const temp = document.createElement('div');
        temp.innerHTML = content;

        while (temp.firstChild) {
          parent.insertBefore(temp.firstChild, el);
        }
      } else if (content instanceof HTMLElement) {
        parent.insertBefore(content.cloneNode(true), el);
      } else if (content instanceof ElementWrapper) {
        for (const childEl of content.elements) {
          parent.insertBefore(childEl.cloneNode(true), el);
        }
      }
    }
    return this;
  }

  remove(): this {
    for (const el of this.elements) {
      el.parentNode?.removeChild(el);
    }
    // Clear the elements array since they're no longer in the DOM
    this.elements = [];
    return this;
  }

  /**
   * Find descendants matching the selector within all elements.
   */
  find(selector: string): ElementWrapper {
    const foundElements: HTMLElement[] = [];
    for (const el of this.elements) {
      const found = el.querySelectorAll(selector);
      foundElements.push(
        ...Array.from(found).filter(
          (node): node is HTMLElement => node.nodeType === Node.ELEMENT_NODE
        )
      );
    }
    return new ElementWrapper(foundElements);
  }

  /**
   * Find the closest ancestor matching the selector for the first element.
   */
  closest(selector: string): ElementWrapper | null {
    const el = this.elements[0];
    if (!el) return null;

    const closest = el.closest(selector) as HTMLElement | null;
    if (!closest) return null;

    return new ElementWrapper([closest]);
  }

  /**
   * Get the parent wrapper of the first element.
   */
  parent(): ElementWrapper | null {
    const el = this.elements[0];
    if (!el) return null;

    const parent = el.parentElement;

    if (!parent) return null;

    return $([parent]);
  }

  /**
   * Get the children wrapper of the first element.
   */
  children(): ElementWrapper | null {
    const el = this.elements[0];
    if (!el) return null;

    const children = el.children;

    if (!children) return null;

    return $(Array.from(children) as HTMLElement[]);
  }

  /**
   * Get the children wrapper of the all elements.
   */
  allChildren(): ElementWrapper | null {
    const children: HTMLElement[] = [];
    for (const el of this.elements) {
      children.push(...(Array.from(el.children) as HTMLElement[]));
    }

    if (!children) return null;

    return $(Array.from(children) as HTMLElement[]);
  }

  /**
   * Bind the value of a ref into the element's inner HTML.
   */
  bindHTML<T>(ref: Ref<T>): this {
    $effect(() => {
      this.html(String(ref()));
    });

    return this;
  }

  /**
   * Bind the value of a ref into the element's text content.
   */
  bind<T>(ref: Ref<T>): this {
    $effect(() => {
      this.text(String(ref()));
    });

    return this;
  }

  /**
   * Bind the input value of the first element into a ref value.
   */
  bindInput<T>(ref: Ref<T>): this {
    const el = this.elements[0];
    if (!el) return this;

    el.addEventListener('input', () => {
      ref((el as HTMLInputElement).value as T);
    });
    return this;
  }

  attr(key: string): string | null;
  attr(key: string, value: string): this;
  attr(key: string, value?: string): this | string | null {
    if (value === undefined) {
      const el = this.elements[0];
      if (!el) return null;

      return el.getAttribute(key);
    }

    for (const el of this.elements) {
      el.setAttribute(key, value);
    }
    return this;
  }

  /**
   * Get or set data attributes.
   */
  data(key: string): string | undefined;
  data(key: string, value: string): this;
  data(key: string, value?: string): this | string | undefined {
    if (value === undefined) {
      const el = this.elements[0];
      if (!el) return;

      return el.dataset[key];
    }

    for (const el of this.elements) {
      el.dataset[key] = value;
    }
    return this;
  }

  private on<K extends keyof HTMLElementEventMap>(
    event: K,
    callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
  ): this {
    for (const el of this.elements) {
      el.addEventListener(event, callback);
    }
    return this;
  }

  /**
   * Attach a click event listener to all elements.
   */
  onClick(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['click']) => any
  ): this {
    return this.on('click', callback);
  }

  /**
   * Attach a mouseover event listener to all elements.
   */
  onMouseOver(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['mouseover']) => any
  ): this {
    return this.on('mouseover', callback);
  }

  /**
   * Attach a mouseout event listener to all elements.
   */
  onMouseOut(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['mouseout']) => any
  ): this {
    return this.on('mouseout', callback);
  }

  /**
   * Attach a change event listener to all elements.
   */
  onChange(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['change']) => any
  ): this {
    return this.on('change', callback);
  }

  /**
   * Attach an input event listener to all elements.
   */
  onInput(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['input']) => any
  ): this {
    return this.on('input', callback);
  }

  /**
   * Attach a submit event listener to all elements.
   */
  onSubmit(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['submit']) => any
  ): this {
    return this.on('submit', callback);
  }

  /**
   * Attach a focus event listener to all elements.
   */
  onFocus(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['focus']) => any
  ): this {
    return this.on('focus', callback);
  }

  /**
   * Attach a blur event listener to all elements.
   */
  onBlur(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['blur']) => any
  ): this {
    return this.on('blur', callback);
  }

  /**
   * Attach a keydown event listener to all elements.
   */
  onKeyDown(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['keydown']) => any
  ): this {
    return this.on('keydown', callback);
  }

  /**
   * Attach a keyup event listener to all elements.
   */
  onKeyUp(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['keyup']) => any
  ): this {
    return this.on('keyup', callback);
  }

  /**
   * Attach a keypress event listener to all elements.
   */
  onKeyPress(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['keypress']) => any
  ): this {
    return this.on('keypress', callback);
  }

  /**
   * Attach a double-click event listener to all elements.
   */
  onDblClick(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['dblclick']) => any
  ): this {
    return this.on('dblclick', callback);
  }

  /**
   * Attach a contextmenu event listener to all elements.
   */
  onContextMenu(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['contextmenu']) => any
  ): this {
    return this.on('contextmenu', callback);
  }

  /**
   * Attach a scroll event listener to all elements.
   */
  onScroll(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['scroll']) => any
  ): this {
    return this.on('scroll', callback);
  }

  /**
   * Attach a resize event listener to all elements.
   */
  onResize(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['resize']) => any
  ): this {
    return this.on('resize', callback);
  }

  /**
   * Attach a load event listener to all elements.
   */
  onLoad(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['load']) => any
  ): this {
    return this.on('load', callback);
  }

  /**
   * Attach a drag event listener to all elements.
   */
  onDrag(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['drag']) => any
  ): this {
    return this.on('drag', callback);
  }

  /**
   * Attach a drop event listener to all elements.
   */
  onDrop(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['drop']) => any
  ): this {
    return this.on('drop', callback);
  }

  /**
   * Get the elements at even positions (1-based indexing).
   */
  even() {
    const elements: HTMLElement[] = [];
    for (let i = 0; i < this.elements.length; i++) {
      if ((i + 1) % 2 == 0 && this.elements[i])
        elements.push(this.elements[i] as HTMLElement);
    }
    return new ElementWrapper(elements);
  }

  /**
   * Get the elements at odd positions (1-based indexing).
   */
  odd() {
    const elements: HTMLElement[] = [];
    for (let i = 0; i < this.elements.length; i++) {
      if ((i + 1) % 2 == 1 && this.elements[i])
        elements.push(this.elements[i] as HTMLElement);
    }
    return new ElementWrapper(elements);
  }
  /**
   * Hide all elements.
   */
  hide(): this {
    for (const el of this.elements) {
      if (!el.dataset.originalDisplay) {
        const computedStyle = window.getComputedStyle(el);
        el.dataset.originalDisplay = computedStyle.display;
      }

      el.style.display = 'none';
    }

    return this;
  }

  /**
   * Show all elements.
   */
  show(): this {
    for (const el of this.elements) {
      const originalDisplay = el.dataset.originalDisplay || '';
      el.style.display = originalDisplay === 'none' ? 'block' : originalDisplay;

      // Clean up the data attribute
      delete el.dataset.originalDisplay;
    }

    return this;
  }

  /**
   * Toggle visibility of all elements.
   */
  toggle(): this {
    for (const el of this.elements) {
      const isVisible = window.getComputedStyle(el).display !== 'none';

      if (isVisible) {
        if (!el.dataset.originalDisplay) {
          el.dataset.originalDisplay = window.getComputedStyle(el).display;
        }

        el.style.display = 'none';
      } else {
        const originalDisplay = el.dataset.originalDisplay || 'block';
        el.style.display = originalDisplay;

        // Clean up the data attribute
        delete el.dataset.originalDisplay;
      }
    }

    return this;
  }

  /**
   * Get the nth element (0-based indexing).
   */
  eq(idx: number): ElementWrapper {
    const el = this.elements[idx];
    return new ElementWrapper(el ? [el] : []);
  }

  /**
   * Get the first element.
   */
  first() {
    return this.eq(0);
  }

  /**
   * Get the last element.
   */
  last() {
    if (this.elements.length === 0) return new ElementWrapper([]);
    return this.eq(this.elements.length - 1);
  }

  /**
   * Filter elements based on a predicate function or CSS selector.
   */
  filter(
    predicate: string | ((element: HTMLElement, index: number) => boolean)
  ): ElementWrapper {
    let filteredElements: HTMLElement[];

    if (typeof predicate === 'string') {
      // Filter by CSS selector
      filteredElements = this.elements.filter((el) => el.matches(predicate));
    } else {
      // Filter by predicate function
      filteredElements = this.elements.filter((el, index) =>
        predicate(el, index)
      );
    }

    return new ElementWrapper(filteredElements);
  }

  forEach(callback: (el: ElementWrapper) => {}) {
    for (const el of this.elements) {
      callback(new ElementWrapper([el]));
    }
  }
}

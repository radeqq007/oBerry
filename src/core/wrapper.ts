import { $watch, type Ref } from './reactivity.js';
import { $ } from './selector.js';

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
   * Add a class to all elements
   */
  addClass(className: string): this {
    this.elements.forEach(el => el.classList.add(className));
    return this;
  }

  /**
   * Remove a class to all elements
   */
  removeClass(className: string): this {
    this.elements.forEach(el => el.classList.remove(className));
    return this;
  }

  /**
   * Toggle a class on all elements
   */
  toggleClass(className: string): this {
    this.elements.forEach(el => el.classList.toggle(className));
    return this;
  }

  /**
   * Modify the style of all elements
   */
  css(styles: Partial<CSSStyleDeclaration>): this {
    this.elements.forEach(el => {
      Object.assign(el.style, styles);
    });
    return this;
  }

  /**
   * Set the inner HTML of all elements
   */
  setHTML(content: string) {
    this.elements.forEach(el => {
      el.innerHTML = content;
    });
  }

  /**
   * Get the inner HTML of the first element
   */
  getHTML(): string | null {
    return this.elements[0]?.innerHTML ?? null;
  }

  /**
   * Set the inner text of all elements
   */
  setText(content: string) {
    this.elements.forEach(el => {
      el.innerText = content;
    });
  }

  /**
   * Get the inner Text of the first element
   */
  getText(): string | null {
    return this.elements[0]?.innerText ?? null;
  }

  /**
   *  Get the array of elements
   */
  getArray(): HTMLElement[] {
    return Array.from(this.elements);
  }

  /**
   * Get the value of the first element
   */
  getValue() {
    const el = this.elements[0];
    if (!el) return null;

    if (
      el instanceof HTMLInputElement ||
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLSelectElement
    ) {
      return el.value;
    }

    return null;
  }

  /**
   * Set the value of the first element
   */
  setValue(newValue: any): this {
    const el = this.elements[0];
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
   * Append elements to all selected elements
   */
  append(content: string | HTMLElement | ElementWrapper): this {
    this.elements.forEach(el => {
      if (typeof content === 'string') el.innerHTML += content;
      else if (content instanceof HTMLElement) el.appendChild(content);
      else if (content instanceof ElementWrapper)
        content.elements.forEach(child => {
          el.appendChild(child.cloneNode(true));
        });
    });
    return this;
  }

  /**
   * Prepend elements to all selected elements
   */
  prepend(content: string | HTMLElement | ElementWrapper): this {
    this.elements.forEach(el => {
      if (typeof content === 'string') el.innerHTML = content + el.innerHTML;
      else if (content instanceof HTMLElement)
        el.insertBefore(content.cloneNode(true), el.firstChild);
      else if (content instanceof ElementWrapper)
        content.elements.forEach((childEl, index) => {
          el.insertBefore(childEl.cloneNode(true), el.children[index] || null);
        });
    });
    return this;
  }

  /**
   * Insert elements after all selected elements
   */
  after(content: string | HTMLElement | ElementWrapper): this {
    this.elements.forEach(el => {
      const parent = el.parentNode;
      if (!parent) return;

      if (typeof content === 'string') {
        const temp = document.createElement('div');
        temp.innerHTML = content;

        while (temp.firstChild) {
          parent.insertBefore(temp.firstChild, el.nextSibling);
        }
      } else if (content instanceof HTMLElement) {
        parent.insertBefore(content.cloneNode(true), el.nextSibling);
      } else if (content instanceof ElementWrapper) {
        content.elements.forEach(childEl => {
          parent.insertBefore(childEl.cloneNode(true), el.nextSibling);
        });
      }
    });
    return this;
  }

  /**
   * Insert elements before all selected elements
   */
  before(content: string | HTMLElement | ElementWrapper): this {
    this.elements.forEach(el => {
      const parent = el.parentNode;
      if (!parent) return;

      if (typeof content === 'string') {
        const temp = document.createElement('div');
        temp.innerHTML = content;

        while (temp.firstChild) {
          parent.insertBefore(temp.firstChild, el);
        }
      } else if (content instanceof HTMLElement) {
        parent.insertBefore(content.cloneNode(true), el);
      } else if (content instanceof ElementWrapper) {
        content.elements.forEach(childEl => {
          parent.insertBefore(childEl.cloneNode(true), el);
        });
      }
    });
    return this;
  }

  /**
   * Get the parent wrapper of the first element
   */
  parent(): ElementWrapper | null {
    const el = this.elements[0];
    if (!el) return null;

    const parent = el.parentElement;

    if (!parent) return null;

    return $(parent);
  }

  children(): ElementWrapper | null {
    const el = this.elements[0];
    if (!el) return null;

    const children = el.children;

    if (!children) return null;

    return $(Array.from(children) as HTMLElement[]);
  }

  allChildren(): ElementWrapper | null {
    const children: HTMLElement[] = [];
    this.elements.forEach(el => {
      children.push(...(Array.from(el.children) as HTMLElement[]));
    });

    if (!children) return null;

    return $(Array.from(children) as HTMLElement[]);
  }

  /**
   * Get the children of the first element
   */
  childrenArray(): HTMLElement[] {
    const el = this.elements[0];
    if (!el) return [];

    return Array.from(el.children) as HTMLElement[];
  }

  /**
   * Get the children of all the elements
   */
  allChildrenArray(): HTMLElement[] {
    const children: HTMLElement[] = [];
    this.elements.forEach(el => {
      children.push(...(Array.from(el.children) as HTMLElement[]));
    });

    return children;
  }

  bindHTML(ref: Ref): this {
    $watch(ref, () => {
      this.setHTML(ref.value);
    });

    return this;
  }

  bind(ref: Ref): this {
    $watch(ref, () => {
      this.setText(ref.value);
    });

    return this;
  }

  bindInput(ref: Ref): this {
    const el = this.elements[0];
    if (!el) return this;

    el.addEventListener('input', () => {
      ref.value = (el as HTMLInputElement).value;
    });
    return this;
  }

  private on<K extends keyof HTMLElementEventMap>(
    event: K,
    callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
  ): this {
    this.elements.forEach(el => el.addEventListener(event, callback));
    return this;
  }

  /**
   * Attach a click event listener to all elements
   */
  onClick(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['click']) => any
  ): this {
    return this.on('click', callback);
  }

  /**
   * Attach a mouseover event listener to all elements
   */
  onMouseOver(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['mouseover']) => any
  ): this {
    return this.on('mouseover', callback);
  }

  /**
   * Attach a mouseout event listener to all elements
   */
  onMouseOut(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['mouseout']) => any
  ): this {
    return this.on('mouseout', callback);
  }

  /**
   * Attach a change event listener to all elements
   */
  onChange(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['change']) => any
  ): this {
    return this.on('change', callback);
  }

  /**
   * Attach an input event listener to all elements
   */
  onInput(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['input']) => any
  ): this {
    return this.on('input', callback);
  }

  /**
   * Attach a submit event listener to all elements
   */
  onSubmit(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['submit']) => any
  ): this {
    return this.on('submit', callback);
  }

  /**
   * Attach a focus event listener to all elements
   */
  onFocus(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['focus']) => any
  ): this {
    return this.on('focus', callback);
  }

  /**
   * Attach a blur event listener to all elements
   */
  onBlur(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['blur']) => any
  ): this {
    return this.on('blur', callback);
  }

  /**
   * Attach a keydown event listener to all elements
   */
  onKeyDown(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['keydown']) => any
  ): this {
    return this.on('keydown', callback);
  }

  /**
   * Attach a keyup event listener to all elements
   */
  onKeyUp(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['keyup']) => any
  ): this {
    return this.on('keyup', callback);
  }

  /**
   * Attach a keypress event listener to all elements
   */
  onKeyPress(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['keypress']) => any
  ): this {
    return this.on('keypress', callback);
  }

  /**
   * Attach a double-click event listener to all elements
   */
  onDblClick(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['dblclick']) => any
  ): this {
    return this.on('dblclick', callback);
  }

  /**
   * Attach a contextmenu event listener to all elements
   */
  onContextMenu(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['contextmenu']) => any
  ): this {
    return this.on('contextmenu', callback);
  }

  /**
   * Attach a scroll event listener to all elements
   */
  onScroll(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['scroll']) => any
  ): this {
    return this.on('scroll', callback);
  }

  /**
   * Attach a resize event listener to all elements
   */
  onResize(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['resize']) => any
  ): this {
    return this.on('resize', callback);
  }

  /**
   * Attach a load event listener to all elements
   */
  onLoad(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['load']) => any
  ): this {
    return this.on('load', callback);
  }

  /**
   * Attach a drag event listener to all elements
   */
  onDrag(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['drag']) => any
  ): this {
    return this.on('drag', callback);
  }

  /**
   * Attach a drop event listener to all elements
   */
  onDrop(
    callback: (this: HTMLElement, ev: HTMLElementEventMap['drop']) => any
  ): this {
    return this.on('drop', callback);
  }

  even() {
    const elements: HTMLElement[] = [];
    for (let i = 0; i < this.elements.length; i++) {
      if ((i + 1) % 2 == 0 && this.elements[i])
        elements.push(this.elements[i] as HTMLElement);
    }
    return new ElementWrapper(elements);
  }

  odd() {
    const elements: HTMLElement[] = [];
    for (let i = 0; i < this.elements.length; i++) {
      if ((i + 1) % 2 == 1 && this.elements[i])
        elements.push(this.elements[i] as HTMLElement);
    }
    return new ElementWrapper(elements);
  }
  /**
   * Hide all elements
   */
  hide(): this {
    this.elements.forEach(el => {
      if (!el.dataset.originalDisplay) {
        const computedStyle = window.getComputedStyle(el);
        el.dataset.originalDisplay = computedStyle.display;
      }

      el.style.display = 'none';
    });

    return this;
  }

  /**
   * Show all elements
   */
  show(): this {
    this.elements.forEach(el => {
      const originalDisplay = el.dataset.originalDisplay || '';
      el.style.display = originalDisplay === 'none' ? 'block' : originalDisplay;

      // Clean up the data attribute
      delete el.dataset.originalDisplay;
    });

    return this;
  }

  /**
   * Toggle visibility of all elements
   */
  toggle(): this {
    this.elements.forEach(el => {
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
    });

    return this;
  }

  eq(idx: number): ElementWrapper {
    const el = this.elements[idx];
    return new ElementWrapper(el ? [el] : []);
  }

  first() {
    return this.eq(0);
  }

  last() {
    if (this.elements.length === 0) return new ElementWrapper([]);
    return this.eq(this.elements.length - 1);
  }
}

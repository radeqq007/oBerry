import { $watch, Reactive } from './reactivity.js';

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
   * Get the parent of the first element
   */
  parent(): HTMLElement | null {
    const el = this.elements[0];
    if (!el) return null;

    return el.parentElement;
  }

  /**
   * Get the children of the first element
   */
  children(): HTMLElement[] {
    const el = this.elements[0];
    if (!el) return [];

    return Array.from(el.children) as HTMLElement[];
  }

  /**
   * Get the children of all the elements
   */
  allChildren(): HTMLElement[] {
    const children: HTMLElement[] = [];
    this.elements.forEach(el => {
      children.push(...(Array.from(el.children) as HTMLElement[]));
    });

    return children;
  }

  bindHTML(ref: Reactive): this {
    $watch(ref, () => {
      this.setHTML(ref.value);
    });

    return this;
  }

  bind(ref: Reactive): this {
    $watch(ref, () => {
      this.setText(ref.value);
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
}

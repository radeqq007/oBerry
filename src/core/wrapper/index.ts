import type { Ref } from "../../types/index";
import { $effect } from "../reactivity";

type ClassMode = "add" | "remove" | "toggle";

export class ElementWrapper<T extends HTMLElement = HTMLElement> {
  elements: T[];

  constructor(elements: T[] | NodeList) {
    // Convert NodeList to Array and filter to only HTMLElements because typescripts yells at you otherwise
    if (elements instanceof NodeList) {
      this.elements = Array.from(elements).filter(
        (node): node is HTMLElement => node.nodeType === Node.ELEMENT_NODE,
      ) as T[];
    } else {
      this.elements = elements;
    }
  }

  class(): string[];
  class(name: string): this;
  class(name: string, mode: ClassMode): this;
  class(name?: string, mode?: ClassMode): string[] | this {
    if (name === undefined) {
      // Return the classes of the first element
      // ? Should this return classes of all the elements?
      return Array.from(this.elements[0]?.classList ?? []);
    }

    const classList = name.split(" ");

    // Toggle class by default
    if (mode === undefined || mode === "toggle") {
      for (const el of this.elements) {
        classList.forEach((className) => {
          el.classList.toggle(className);
        });
      }
      return this;
    }

    if (mode === "add") {
      for (const el of this.elements) {
        classList.forEach((className) => {
          el.classList.add(className);
        });
      }
      return this;
    }

    if (mode === "remove") {
      for (const el of this.elements) {
        classList.forEach((className) => {
          el.classList.remove(className);
        });
      }
      return this;
    }

    return this;
  }

  hasClass(className: string): boolean {
    const el = this.elements[0];
    if (!el) {
      return false;
    }

    return el.classList.contains(className);
  }

  id(): string | undefined;
  id(id: string): this;
  id(id?: string): string | undefined | this {
    if (id === undefined) {
      const el = this.elements[0];
      return el?.id ?? undefined;
    }

    if (this.elements[0]) {
      this.elements[0].id = id;
    }

    return this;
  }

  /**
   * Modify the style of all elements.
   */
  css(styles: Partial<CSSStyleDeclaration>): this {
    for (const el of this.elements) {
      Object.assign(el.style, styles);
    }
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
  getArray(): T[] {
    return Array.from(this.elements);
  }

  value(newValue: string): this;
  value(): string | undefined;
  value(newValue?: string): this | string | undefined {
    const el = this.elements[0];

    if (newValue === undefined) {
      if (!el) {
        return undefined;
      }

      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement
      ) {
        return el.value;
      }

      return undefined;
    }

    if (!el) {
      return this;
    }

    if (
      el instanceof HTMLInputElement ||
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLSelectElement
    ) {
      el.value = newValue;
    }

    return this;
  }

  append(content: string): this;
  append(content: HTMLElement): this;
  append(content: ElementWrapper): this;
  append(content: string | HTMLElement | ElementWrapper): this {
    for (const el of this.elements) {
      if (typeof content === "string") {
        el.innerHTML += content;
      } else if (content instanceof HTMLElement) {
        el.appendChild(content.cloneNode(true));
      } else if (content instanceof ElementWrapper) {
        for (const child of content.elements) {
          el.appendChild(child.cloneNode(true));
        }
      }
    }
    return this;
  }

  prepend(content: string): this;
  prepend(content: HTMLElement): this;
  prepend(content: ElementWrapper): this;
  prepend(content: string | HTMLElement | ElementWrapper): this {
    for (const el of this.elements) {
      if (typeof content === "string") {
        el.innerHTML = content + el.innerHTML;
      } else if (content instanceof HTMLElement) {
        el.insertBefore(content.cloneNode(true), el.firstChild);
      } else if (content instanceof ElementWrapper) {
        content.elements.forEach((childEl, index) => {
          el.insertBefore(childEl.cloneNode(true), el.children[index] || null);
        });
      }
    }
    return this;
  }

  after(content: string): this;
  after(content: HTMLElement): this;
  after(content: ElementWrapper): this;
  after(content: string | HTMLElement | ElementWrapper): this {
    for (const el of this.elements) {
      const parent = el.parentNode;
      if (!parent) {
        continue;
      }

      if (typeof content === "string") {
        const temp = document.createElement("div");
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

  before(content: string): this;
  before(content: HTMLElement): this;
  before(content: ElementWrapper): this;
  before(content: string | HTMLElement | ElementWrapper): this {
    for (const el of this.elements) {
      const parent = el.parentNode;
      if (!parent) {
        continue;
      }

      if (typeof content === "string") {
        const temp = document.createElement("div");
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

  /**
   * Remove all the elements from DOM.
   */
  remove(): this {
    for (const el of this.elements) {
      el.parentNode?.removeChild(el);
    }
    // Clear the elements array since they're no longer in the DOM
    this.elements = [];
    return this;
  }

  is(selector: string): boolean {
    const el = this.elements[0];
    if (!el) {
      return false;
    }

    return el.matches(selector);
  }

  /**
   * Filter out elements that match the given selector, returning those that don't match.
   */
  not(selector: string): ElementWrapper<T> {
    const filteredElements = this.elements.filter(
      (el) => !el.matches(selector),
    );
    return new ElementWrapper<T>(filteredElements);
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
          (node): node is HTMLElement => node.nodeType === Node.ELEMENT_NODE,
        ),
      );
    }
    return new ElementWrapper(foundElements);
  }

  /**
   * Find the closest ancestor matching the selector for the first element.
   */
  closest(selector: string): ElementWrapper {
    const el = this.elements[0];
    if (!el) {
      return new ElementWrapper([]);
    }

    const closest = el.closest(selector) as HTMLElement | null;
    if (!closest) {
      return new ElementWrapper([]);
    }

    return new ElementWrapper([closest]);
  }

  /**
   * Get the parent wrapper of the first element.
   */
  parent(): ElementWrapper {
    const el = this.elements[0];
    if (!el) {
      return new ElementWrapper([]);
    }

    const parent = el.parentElement;

    if (!parent) {
      return new ElementWrapper([]);
    }

    return new ElementWrapper([parent]);
  }

  /**
   * Get the children wrapper of the first element.
   */
  children(): ElementWrapper {
    const el = this.elements[0];
    if (!el) {
      return new ElementWrapper([]);
    }

    const children = el.children;

    if (!children) {
      return new ElementWrapper([]);
    }

    return new ElementWrapper(Array.from(children) as HTMLElement[]);
  }

  /**
   * Get the children wrapper of the all elements.
   */
  allChildren(): ElementWrapper {
    const children: HTMLElement[] = [];
    for (const el of this.elements) {
      children.push(...(Array.from(el.children) as HTMLElement[]));
    }

    return new ElementWrapper(children);
  }

  /**
   * Bind the value of a ref into the element's inner HTML.
   */
  bindHTML<V>(ref: Ref<V>): this {
    $effect(() => {
      this.html(String(ref()));
    });

    return this;
  }

  /**
   * Bind the value of a ref into the element's text content.
   */
  bind<V>(ref: Ref<V>): this {
    $effect(() => {
      this.text(String(ref()));
    });

    return this;
  }

  /**
   * Bind the value of a ref into the element's attribute.
   */
  bindAttr<V>(attr: string, ref: Ref<V>): this {
    $effect(() => {
      this.attr(attr, String(ref()));
    });

    return this;
  }

  /**
   * Bind the input value of the first element into a ref value.
   */
  bindInput<V>(ref: Ref<V>): this {
    const el = this.elements[0];
    if (!el) {
      return this;
    }

    el.addEventListener("input", () => {
      ref((el as any)?.value);
    });

    $effect(() => {
      (el as any).value = String(ref());
    });

    return this;
  }

  attr(key: string): string | undefined;
  attr(key: string, value: string): this;
  attr(key: string, value?: string): this | string | undefined {
    if (value === undefined) {
      const el = this.elements[0];
      if (!el) {
        return undefined;
      }

      const attr = el.getAttribute(key);
      return attr ?? undefined;
    }

    for (const el of this.elements) {
      el.setAttribute(key, value);
    }
    return this;
  }

  data(key: string): string | undefined;
  data(key: string, value: string): this;
  data(key: string, value?: string): this | string | undefined {
    if (value === undefined) {
      const el = this.elements[0];
      if (!el) {
        return undefined;
      }

      return el.dataset[key];
    }

    for (const el of this.elements) {
      el.dataset[key] = value;
    }
    return this;
  }

  on<K extends keyof HTMLElementEventMap>(
    event: K,
    callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void,
  ): this {
    for (const el of this.elements) {
      el.addEventListener(event, callback as EventListener);
    }
    return this;
  }

  off<K extends keyof HTMLElementEventMap>(event: K, callback: EventListener) {
    for (const el of this.elements) {
      el.removeEventListener(event, callback);
    }
    return this;
  }

  /**
   * Get the elements at even positions (1-based indexing).
   */
  even() {
    const elements: T[] = [];
    for (let i = 0; i < this.elements.length; i++) {
      if ((i + 1) % 2 === 0 && this.elements[i]) {
        elements.push(this.elements[i] as T);
      }
    }
    return new ElementWrapper<T>(elements);
  }

  /**
   * Get the elements at odd positions (1-based indexing).
   */
  odd() {
    const elements: T[] = [];
    for (let i = 0; i < this.elements.length; i++) {
      if ((i + 1) % 2 === 1 && this.elements[i]) {
        elements.push(this.elements[i] as T);
      }
    }
    return new ElementWrapper<T>(elements);
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

      el.style.display = "none";
    }

    return this;
  }

  /**
   * Show all elements.
   */
  show(): this {
    for (const el of this.elements) {
      const originalDisplay = el.dataset.originalDisplay || "";
      el.style.display = originalDisplay === "none" ? "block" : originalDisplay;

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
      const isVisible = window.getComputedStyle(el).display !== "none";

      if (isVisible) {
        if (!el.dataset.originalDisplay) {
          el.dataset.originalDisplay = window.getComputedStyle(el).display;
        }

        el.style.display = "none";
      } else {
        const originalDisplay = el.dataset.originalDisplay || "block";
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
  eq(idx: number): ElementWrapper<T> {
    const el = this.elements[idx];
    return new ElementWrapper<T>(el ? [el] : []);
  }

  first() {
    return this.eq(0);
  }

  last() {
    if (this.elements.length === 0) {
      return new ElementWrapper<T>([]);
    }
    return this.eq(this.elements.length - 1);
  }

  /**
   * Filter elements based on a predicate function or CSS selector.
   */
  filter(
    predicate: string | ((element: T, index: number) => boolean),
  ): ElementWrapper<T> {
    let filteredElements: T[];

    if (typeof predicate === "string") {
      // Filter by CSS selector
      filteredElements = this.elements.filter((el) => el.matches(predicate));
    } else {
      // Filter by predicate function
      filteredElements = this.elements.filter((el, index) =>
        predicate(el, index),
      );
    }

    return new ElementWrapper<T>(filteredElements);
  }

  forEach(callback: (el: ElementWrapper<T>, index: number) => void) {
    for (let i = 0; i < this.elements.length; i++) {
      const el = this.elements[i];
      if (el !== undefined) {
        callback(new ElementWrapper<T>([el]), i);
      }
    }
  }

  length(): number {
    return this.elements.length;
  }

  isEmpty() {
    return this.elements.length === 0;
  }

  static extend(name: string, func: (...args: any[]) => any) {
    (ElementWrapper as any).prototype[name] = func;
  }
}

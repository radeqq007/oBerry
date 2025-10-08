import { ElementWrapper } from "../wrapper";

export function $(selector: string): ElementWrapper;
export function $(selector: NodeList): ElementWrapper;
export function $(selector: HTMLElement): ElementWrapper;
export function $(selector: HTMLElement[]): ElementWrapper;
export function $(
  selector: string | HTMLElement | NodeList | HTMLElement[]
): ElementWrapper {
  let elements: HTMLElement[] | NodeList = [];
  if (typeof selector === "string") {
    elements = document.querySelectorAll(selector);
  } else if (selector instanceof HTMLElement) {
    elements = [selector];
  } else if (selector instanceof NodeList || Array.isArray(selector)) {
    elements = selector;
  } else {
    throw new Error("Invalid selector type");
  }
  return new ElementWrapper(elements);
}

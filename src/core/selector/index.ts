import { ElementWrapper } from "../wrapper";

export function $<T extends HTMLElement>(selector: string): ElementWrapper;
export function $<T extends HTMLElement>(selector: NodeList): ElementWrapper;
export function $<T extends HTMLElement>(selector: HTMLElement): ElementWrapper;
export function $<T extends HTMLElement>(selector: HTMLElement[]): ElementWrapper;
export function $<T extends HTMLElement> (
	selector: string | HTMLElement | NodeList | HTMLElement[],
): ElementWrapper {
	let elements: HTMLElement[] | NodeList = [];
	if (typeof selector === "string") {
		elements = document.querySelectorAll(selector) as NodeListOf<T>;
	} else if (selector instanceof HTMLElement) {
		elements = [selector] as T[];
	} else if (selector instanceof NodeList || Array.isArray(selector)) {
		elements = selector as NodeListOf<T> | T[];
	} else {
		throw new Error("Invalid selector type");
	}
	return new ElementWrapper(elements);
}

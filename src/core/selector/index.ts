import { ElementWrapper } from "../wrapper";

export function $<T extends HTMLElement = HTMLElement>(selector: string): ElementWrapper<T>;
export function $<T extends HTMLElement = HTMLElement>(selector: NodeList): ElementWrapper<T>;
export function $<T extends HTMLElement = HTMLElement>(selector: T): ElementWrapper<T>;
export function $<T extends HTMLElement = HTMLElement>(selector: T[]): ElementWrapper<T>;
export function $<T extends HTMLElement = HTMLElement> (
	selector: string | T | NodeList | T[],
): ElementWrapper<T> {
	let elements: T[] = [];
	
	if (typeof selector === "string") {
		elements = Array.from(document.querySelectorAll<T>(selector));
	} else if (selector instanceof HTMLElement) {
		elements = [selector as T];
	} else if (selector instanceof NodeList) {
		elements = Array.from(selector) as T[];
	} else {
		elements = selector as T[]
	}

	return new ElementWrapper<T>(elements);
}

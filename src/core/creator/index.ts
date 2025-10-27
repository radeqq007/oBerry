import { ElementWrapper } from "../wrapper";

export function $new(
	tag: string,
	...children: ElementWrapper[]
): ElementWrapper {
	const el = document.createElement(tag);
	const wrapper = new ElementWrapper([el]);

	for (const child of children) {
		wrapper.append(child);
	}

	return wrapper;
}

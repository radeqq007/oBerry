import { beforeEach, vi } from "vitest";

// Clean up DOM before each test
beforeEach(() => {
	document.body.innerHTML = "";
	document.head.innerHTML = "";
});

vi.mock("alien-signals", () => ({
	signal: (initialValue: any) => {
		let value = initialValue;
		const fn = (newValue?: any) => {
			if (newValue === undefined) return value;

			value = newValue;
		};

		return fn;
	},
	computed: (computation: () => any) => {
		const fn = () => computation();
		return fn;
	},

	effect: (callback: () => void) => {
		callback();
		return () => {
			/* Cleanup function */
		};
	},
	effectScope: (callback: () => void) => {
		callback();
		return () => {
			/* Stop function */
		};
	},
}));

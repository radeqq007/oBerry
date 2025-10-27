import { beforeEach, describe, expect, it } from "vitest";
import { $ } from "../../src/core/selector/index";
import { ElementWrapper } from "../../src/core/wrapper/index";

describe("Selector ($)", () => {
	beforeEach(() => {
		document.body.innerHTML = `
    <div id="test-id" class="test-class">Test Div</div>
    <p class="test-class">Test Paragraph</p>
    <span class="another-class">Test Span</span>
      <div class="parent">
        <div class="child">Child 1</div>
        <div class="child">Child 2</div>
      </div>
    `;
	});

	it("should select an element by ID", () => {
		const wrapper = $("#test-id");
		expect(wrapper).toBeInstanceOf(ElementWrapper);
		expect(wrapper.elements).toHaveLength(1);
		expect(wrapper.elements[0].id).toBe("test-id");
	});

	it("should select elements by class", () => {
		const wrapper = $(".test-class");
		expect(wrapper).toBeInstanceOf(ElementWrapper);
		expect(wrapper.elements).toHaveLength(2);
		expect(wrapper.elements[0].className).toBe("test-class");
		expect(wrapper.elements[1].className).toBe("test-class");
	});

	it("should select elements by tag name", () => {
		const wrapper = $("div");
		expect(wrapper).toBeInstanceOf(ElementWrapper);
		expect(wrapper.elements.length).toBeGreaterThan(0);
		expect(wrapper.elements[0].tagName.toLowerCase()).toBe("div");
	});

	it("should select elements with complex selectors", () => {
		const wrapper = $(".parent .child");
		expect(wrapper).toBeInstanceOf(ElementWrapper);
		expect(wrapper.elements).toHaveLength(2);
	});

	it("should handle HTMLElement input", () => {
		const element = document.getElementById("test-id")!;
		const wrapper = $(element);
		expect(wrapper).toBeInstanceOf(ElementWrapper);
		expect(wrapper.elements).toHaveLength(1);
		expect(wrapper.elements[0]).toBe(element);
	});

	it("should handle NodeList input", () => {
		const nodeList = document.querySelectorAll(".test-class");
		const wrapper = $(nodeList);
		expect(wrapper).toBeInstanceOf(ElementWrapper);
		expect(wrapper.elements).toHaveLength(2);
	});

	it("should handle HTMLElement array input", () => {
		const elements = Array.from(
			document.querySelectorAll(".test-class"),
		) as HTMLElement[];
		const wrapper = $(elements);
		expect(wrapper).toBeInstanceOf(ElementWrapper);
		expect(wrapper.elements).toHaveLength(2);
	});

	it("should return empty wrapper for non-existent elements", () => {
		const wrapper = $("#non-existent");
		expect(wrapper).toBeInstanceOf(ElementWrapper);
		expect(wrapper.elements).toHaveLength(0);
	});

	it("should throw error for invalid selector type", () => {
		expect(() => $(123 as any)).toThrow("Invalid selector type");
	});
});

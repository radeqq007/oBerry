import { ElementWrapper } from '../wrapper';

export type CreateOptions = {
  classList?: string[];
  id?: string;
  attributes?: Record<string, string>;
  text?: string;
  children?: (string | HTMLElement | ElementWrapper)[];
};

export function $create(tag: string, options?: CreateOptions): ElementWrapper {
  const el = document.createElement(tag);
  const wrapper = new ElementWrapper([el]);

  if (options) {
    if (options.classList) {
      for (const className of options.classList) {
        wrapper.addClass(className);
      }
    }

    if (options.id) {
      wrapper.setId(options.id);
    }

    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        wrapper.setAttr(key, value);
      });
    }

    if (options.children) {
      options.children.forEach(child => {
        wrapper.append(child);
      });
    }

    if (options.text) {
      wrapper.setText(options.text);
    }
  }

  return wrapper;
}

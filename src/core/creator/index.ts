import { ElementWrapper } from "../wrapper";

export function $new(tag: string): ElementWrapper;
export function $new(tag: string, children: ElementWrapper): ElementWrapper;
export function $new(tag: string, children?: ElementWrapper): ElementWrapper {
  const el = document.createElement(tag);
  const wrapper = new ElementWrapper([el]);
  if (children) {
    wrapper.append(children);
  }
  return wrapper;
}

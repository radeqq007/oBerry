import { ElementWrapper } from '../wrapper';

export function $create(tag: string): ElementWrapper {
  const el = document.createElement(tag);
  const wrapper = new ElementWrapper([el]);
  return wrapper;
}

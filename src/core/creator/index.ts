import { ElementWrapper } from '../wrapper';

export function $new(tag: string): ElementWrapper {
  const el = document.createElement(tag);
  const wrapper = new ElementWrapper([el]);
  return wrapper;
}

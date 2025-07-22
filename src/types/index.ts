export type { ElementWrapper } from '../core/wrapper';

export type Signal<T> = {
  (): T;
  (value: T): void;
};

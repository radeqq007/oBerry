export type { ElementWrapper } from "../core/wrapper";

export type Ref<T> = {
  (): T;
  (value: T): void;
};

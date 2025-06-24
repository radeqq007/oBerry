/**
 * Creates a reactive reference to a value. If the value is null or undefined,
 * creates a reactive reference with null as the initial value.
 *
 * @param {*} value - The initial value to make reactive
 * @returns {Reactive} A new Reactive instance wrapping the provided value
 */
export function $ref(value: any) {
  if (value == null || value === undefined) {
    return new Reactive(null);
  }

  return new Reactive(value);
}

export class Reactive {
  watchers: Array<Function> = [];
  _value: any = null;

  constructor(value: any) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    if (this._value !== newValue) {
      const oldValue = this._value;
      this._value = newValue;
      this.watchers.forEach(watcher => watcher(newValue, oldValue));
    }
  }
}

export function $watch(ref: Reactive, watcher: Function) {
  ref.watchers.push(watcher);
}

/**
 * Creates a reactive reference to a value. If the value is null or undefined,
 * creates a reactive reference with null as the initial value.
 *
 * @param {*} value - The initial value to make reactive
 * @returns {Reactive} A new Reactive instance wrapping the provided value
 */
export function $ref(value) {
  if (value == null || value === undefined) {
    return new Reactive(null);
  }

  return new Reactive(value);
}

class Reactive {
  /**
   * Array of watcher functions that will be called when the value changes.
   * Each watcher receives (newValue, oldValue) as parameters.
   *
   * @type {Function[]}
   * @private
   */
  watchers = [];
  _value = null;

  constructor(value) {
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

export function $watch(ref, watcher) {
  if (!(ref instanceof Reactive)) {
    throw new Error('The first argument must be a Reactive instance.');
  }

  if (typeof watcher !== 'function') {
    throw new Error('The second argument must be a function.');
  }

  ref.watchers.push(watcher);
}

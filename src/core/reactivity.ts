/**
 * Creates a reactive reference to a value. If the value is null or undefined,
 * creates a reactive reference with null as the initial value.
 */
export function $ref(value: any): Reactive {
  if (value == null || value === undefined) {
    return new Reactive(null);
  }

  return new Reactive(value);
}

abstract class BaseReactive {
  watchers: Array<Function> = [];

  protected notifyWatchers(...args: any[]) {
    this.watchers.forEach(watcher => watcher(...args));
  }

  abstract get value(): any;
  abstract set value(newValue: any);
}

export class Reactive extends BaseReactive {
  private _value: any = null;

  constructor(value: any) {
    super();
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

export function $deepRef(value: any) {
  if (value == null || value === undefined) {
    return new deepReactive(null);
  }

  return new deepReactive(value);
}

export class deepReactive extends BaseReactive {
  private raw: any; // The initial value
  private proxy: any;
  private notifyQueued: boolean = false;

  constructor(value: any) {
    super();
    this.raw = value;

    const notify = () => {
      if (this.notifyQueued) return;
      this.notifyQueued = true;

      // Use microtask to batch notifications (no idea how it works, ai generated it for me)
      Promise.resolve().then(() => {
        this.notifyQueued = false;
        this.watchers.forEach(w => w(this.proxy));
      });
    };

    this.proxy = new Proxy(this.raw, {
      set(target, prop, value, reciever): boolean {
        const res = Reflect.set(target, prop, value, reciever);
        notify();
        return res;
      },

      get: (target, key, receiver) => {
        return Reflect.get(target, key, receiver);
      },
    });
  }

  get value() {
    return this.proxy;
  }

  set value(newValue) {
    this.raw = newValue;
    Object.assign(this.proxy, newValue);
    this.watchers.forEach(w => w(this.proxy));
  }
}

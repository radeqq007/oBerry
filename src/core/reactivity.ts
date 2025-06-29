abstract class Reactive {
  watchers: Function[] = [];

  protected notifyWatchers(...args: any[]) {
    this.watchers.forEach(watcher => watcher(...args));
  }

  abstract get value(): any;
  abstract set value(newValue: any);
}

export class Ref extends Reactive {
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

export class deepRef extends Reactive {
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

/**
 * Creates a reactive reference to a value. If the value is null or undefined,
 * creates a reactive reference with null as the initial value.
 */
export function $ref(value: any): Ref {
  if (value == null || value === undefined) {
    return new Ref(null);
  }

  return new Ref(value);
}

export function $watch(ref: Reactive, watcher: Function) {
  ref.watchers.push(watcher);
}

export function $deepRef(value: any) {
  if (value == null || value === undefined) {
    return new deepRef(null);
  }

  return new deepRef(value);
}

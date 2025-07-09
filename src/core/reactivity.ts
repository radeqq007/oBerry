abstract class Reactive {
  watchers: Array<(...args: any[]) => void> = [];

  protected notifyWatchers(...args: any[]) {
    for (const w of this.watchers) {
      w(...args);
    }
  }

  abstract get value(): any;
  abstract set value(newValue: any);
}

export class Ref extends Reactive {
  private _value: any;

  constructor(value: any) {
    super();
    this._value = value ?? null;
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    if (this._value !== newValue) {
      const oldValue = this._value;
      this._value = newValue;
      for (const w of this.watchers) {
        w(newValue, oldValue);
      }
    }
  }
}

export class deepRef extends Reactive {
  private raw: any; // The initial value
  private proxy: any;

  constructor(value: any) {
    super();
    this.raw = value;

    const notify = () => {
      for (const w of this.watchers) {
        w(this.proxy);
      }
    };

    this.proxy = new Proxy(this.raw, {
      set(target, prop, value, reciever): boolean {
        const res = Reflect.set(target, prop, value, reciever);

        // When pushing to an array watchers would get notified twice because both the values and the length changes
        // Therefore we ignore the length change
        // ^^^ probably not the best solution
        if (prop !== 'length' && Array.isArray(target)) {
          notify();
        }
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

    for (const key of Object.keys(this.proxy)) {
      delete this.proxy[key];
    }

    Object.assign(this.proxy, newValue);
  }
}

/**
 * Creates a reactive reference to a value. If the value is null or undefined,
 * creates a reactive reference with null as the initial value.
 */
export function $ref(value: any = null): Ref {
  return new Ref(value);
}

export function $watch(
  ref: Reactive,
  watcher: (...args: any[]) => void
): () => void {
  ref.watchers.push(watcher);

  // Unwatch function
  return () => {
    const index = ref.watchers.indexOf(watcher);
    if (index > -1) ref.watchers.splice(index, 1);
  };
}

export function $deepRef(value: any = null) {
  return new deepRef(value);
}

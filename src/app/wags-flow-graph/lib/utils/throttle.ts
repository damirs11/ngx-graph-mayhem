/**
 * Throttle a function
 *
 * @export
 * @param {*}      func
 * @param {number} wait
 * @param {*}      [options]
 * @returns
 */
export function throttle(func: any, wait: number, options?: any) {
  options = options || {};
  let context: any;
  let args: any;
  let result: any;
  let timeout: any = null;
  let previous = 0;

  function later() {
    previous = options.leading === false ? 0 : +new Date();
    timeout = null;
    result = func.apply(context, args);
  }

  return function (..._arguments: any[]) {
    const now = +new Date();

    if (!previous && options.leading === false) {
      previous = now;
    }

    const remaining = wait - (now - previous);
    // @ts-ignore
    context = this;
    args = _arguments;

    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };
}

/**
 * Throttle decorator
 *
 *  class MyClass {
 *    throttleable(10)
 *    myFn() { ... }
 *  }
 *
 * @export
 * @param {number} duration
 * @param {*} [options]
 * @returns
 */
export function throttleable(duration: number, options?: any) {
  return function innerDecorator(target: any, key: any, descriptor: any) {
    return {
      configurable: true,
      enumerable: descriptor.enumerable,
      get: function getter(): any {
        Object.defineProperty(this, key, {
          configurable: true,
          enumerable: descriptor.enumerable,
          value: throttle(descriptor.value, duration, options)
        });

        // @ts-ignore
        return this[key];
      }
    };
  };
}

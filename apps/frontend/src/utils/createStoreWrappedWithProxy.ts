import { create, StateCreator } from 'zustand';
import { shallow } from 'zustand/shallow';

export function createStoreWrappedWithProxy<
  T extends Record<string | symbol, any>,
>(initializer: StateCreator<T>) {
  const originalMethod = create<T>(initializer);

  /**
   * Wrapped version of the original useRdsStore function, which solves a performance issue.
   *
   * The original zustand docs describe the intended usage of the `create` function as:
   *
   * ```ts
   * import create from 'zustand'
   *		const useStore = create(set => ({
   *		  count: 1,
   *		  inc: () => set(state => ({ count: state.count + 1 })),
   *		}))
   *
   *		function Controls() {
   *		  const inc = useStore(state => state.inc) // <--- every property/setter on a separate line
   *		  return <button onClick={inc}>one up</button>
   *		}
   *
   *		function Counter() {
   *		  const count = useStore(state => state.count) // <--- every property/setter on a separate line
   *		  return <h1>{count}</h1>
   *		}
   * ```
   *
   * This is a bit verbose.
   * If we have a large store, accessing it would start looking like this:
   *
   * ```ts
   *		  const foo = useStore(state => state.foo);
   *		  const bar = useStore(state => state.bar);
   *		  const baz = useStore(state => state.baz);
   *		  const setFoo = useStore(state => state.setFoo);
   *		  const setBar = useStore(state => state.setBar);
   *		  const setBaz = useStore(state => state.setBaz);
   * ```
   *
   * You can also use a one-liner to assign any number of properties/setters.
   *
   * ```ts
   * 		const { foo, bar, baz, setFoo, setBar, setBaz } = useStore();
   * ```
   *
   * But I found writing this way
   * forces EVERY component accessing the store to be re-rendered every time ANY of the properties change.
   *
   * This wrapper solves that issue.
   *
   */
  const wrapped = function wrapped() {
    return new Proxy({} as any as T, {
      get: (_, key: keyof T) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return originalMethod((state) => {
          //// HACK //// HACK //// HACK //// HACK //// HACK //// HACK //// HACK ////
          ////
          //// This is a workaround for accessing the current ref
          //// to the store outside of react components/hooks.
          ////
          result.singletonRef = state;
          //// HACK //// HACK //// HACK //// HACK //// HACK //// HACK //// HACK ////

          return state[key];
        }, shallow);
      },
    });
  };

  const result = Object.assign(wrapped, {
    originalMethod,
    singletonRef: null as T | null,
  });

  return result;
}

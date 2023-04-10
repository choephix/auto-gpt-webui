import { createStoreWrappedWithProxy } from '../utils/createStoreWrappedWithProxy';

export function createSimpleZustandStore<T extends Record<string, any>>(
  store: T,
) {
  return createStoreWrappedWithProxy<WithSetters<T>>((set, get) => {
    const result: Partial<WithSetters<T>> = { ...store };

    for (const key in store) {
      const setterName = `set${
        key.charAt(0).toUpperCase() + key.slice(1)
      }` as keyof WithSetters<T>;
      // @ts-ignore
      result[setterName] = (value: T[typeof key]) => {
        // @ts-ignore
        set(() => ({ [key as keyof T]: value }));
      };
    }

    return result as WithSetters<T>;
  });
}

type WithSetters<T> = T & {
  [P in keyof T as `set${Capitalize<string & P>}`]: (value: T[P]) => void;
};

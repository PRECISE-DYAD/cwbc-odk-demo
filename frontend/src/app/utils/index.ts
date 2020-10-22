export * from "./guid";

/**
 * Convert an array to an object with keys corresponding to specific
 * array field
 * @param hashField - field within all array elements to use as hash key
 */
export function _arrToHashmap<T>(arr: T[], hashKey: keyof T) {
  const hash: { [hashKey: string]: T } = {};
  arr.forEach((el) => {
    const key = el[hashKey] as any;
    hash[key] = el;
  });
  return hash;
}

/**
 * Wait for a specified amount of time before continuing a function
 * @param ms - number of milliseconds to wait, e.g. 2000 (2s)
 */
export function _wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

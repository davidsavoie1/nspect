import { OWN } from "./constants.js";
import { typeOf } from "./typeOf.js";

export { typeOf } from "./typeOf.js";

const isType = (type) => (x) => typeOf(x) === type;

export const isArr = isType("array");
export const isColl = (x) => ["array", "map", "object"].includes(typeOf(x));
export const isFunc = (x) => typeof x === "function";
export const isNil = (x) => [null, undefined].includes(x);
export const isNum = isType("number");
export const isPromise = (x) => x && isFunc(x.then);
export const isSpec = (x) => isFunc(x) || isColl(x);

/* Given a map of implementations keyed from the return values of `typeOf`
 * and a `posOfColl` argument indicating at which argument position
 * a collection is given, return a function that will pass its arguments
 * to the proposer implementation based on the collection type.
 * A string type can be given instead of a collection. */
export const polymorph = (implementations, posOfColl = 1) => (...args) => {
  const collOrType = args[posOfColl - 1];
  const type =
    typeOf(collOrType) === "string" ? collOrType : typeOf(collOrType);

  const fn = implementations[type] || implementations["_"];
  if (!fn) throw new TypeError(`Not implemented for type '${type}'`);
  return fn(...args);
};

export const entries = polymorph({
  array: (arr) => arr.map((v, i) => [i, v]),
  map: (map) => Array.from(map.entries()),
  object: (obj) => Object.entries(obj),
  _: () => [],
});

export const fromMap = polymorph(
  {
    array: (map) => {
      const indices = Array.from(map.keys()).filter(isNum);
      const maxIndex = Math.max(...indices);
      return Array.from({ length: maxIndex + 1 }, (_, i) => map.get(i));
    },
    map: (map) => new Map(map),
    object: (map) =>
      Object.fromEntries(
        Array.from(map.entries()).filter(([key]) => key !== undefined)
      ),
  },
  2
);

export const fromEntries = (arr, coll) => {
  return fromMap(new Map(arr), coll);
};

export const newColl = polymorph(
  {
    array: () => [],
    map: () => new Map(),
    object: () => ({}),
  },
  1
);

export const get = polymorph(
  {
    array: (index, arr) => arr[index],
    map: (key, map) => map.get(key),
    object: (key, obj) => obj[key],
    _: () => undefined,
  },
  2
);

export const set = polymorph(
  {
    array: (index, value, arr) => Object.assign([], arr, { [index]: value }),
    map: (key, value, map) => map.set(key, value),
    object: (key, value, obj) => Object.assign({}, obj, { [key]: value }),
    _: (key, value, x) => (x[key] = value),
  },
  3
);

export function getPath(path = [], value) {
  return path.reduce((parent, key) => get(key, parent), value);
}

export const keys = polymorph({
  array: (arr) => arr.map((v, i) => i),
  map: (map) => Array.from(map.keys()),
  object: (obj) => Object.keys(obj),
  _: () => [],
});

export function mergePaths(...paths) {
  const path = paths
    .reduce((acc, path) => {
      if (path === undefined) return acc;
      if (isArr(path)) return [...acc, ...path];
      return [...acc, path];
    }, [])
    .filter((key) => key !== undefined);
  return path.length > 0 ? path : undefined;
}

export function asKey(key) {
  if (!isColl(key)) return key;
  return JSON.stringify(key);
}

/* Given a value and a current path, return the sub value
 * at a path relative to current one. */
export function getFromValue(relPath, currPath = [], value) {
  const newPath = relPath.split("/").reduce((acc, move) => {
    if ([null, undefined, "", "."].includes(move)) return acc;

    if (move.startsWith("..")) return acc.slice(0, -1);

    const index = parseInt(move, 10);
    return [...acc, isNaN(index) ? move : index];
  }, currPath);
  return getPath(newPath, value);
}

export function getOwn(value) {
  return value && value[OWN];
}

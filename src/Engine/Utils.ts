import * as fastdom from "fastdom";

/*
 |--------------------------------------------------------------------------------
 | General Utilities
 |--------------------------------------------------------------------------------
 */

/**
 * Safely retrieve a value from a deep nested object.
 *
 * @example
 *
 * const obj = {
 *   b: {
 *     c: [
 *       "foo",
 *        { bar: "foobar" }
 *     ]
 *   }
 * };
 *
 * maybe(obj, "b.c");            // returns 'bar'
 * maybe(obj, "b.c.0");          // returns 'bar'
 * maybe(obj, "b.c.1.bar");      // returns 'foobar'
 * maybe(obj, "b.a");            // returns undefined
 * maybe(obj, "b.a", "Default"); // returns 'Default'
 *
 * @param obj      Object to perform a retrieval on.
 * @param path     String with a dot noted path, or an array of string | number.
 * @param fallback Value to return if path leads to an undefined value.
 *
 * @returns path value, fallback, or undefined
 */
export function maybe<V = any>(obj: any, path: string | string[], fallback?: any): V {
  const keys = Array.isArray(path) ? path : path.split(".");
  let value: any = obj;
  try {
    for (const key of keys) {
      if (value === undefined) {
        return fallback;
      }
      value = value[key];
    }
  } catch (err) {
    return fallback;
  }
  return value === undefined ? fallback : value;
}

/**
 * Deep copies provided object, returning a immutable result. If performance is
 * a minor concern, consider using immutable.js
 *
 * @param o Object, or array to copy.
 *
 * @returns deep copy of provided object
 */
export function deepCopy(o: any): any {
  let newO: any;
  let i: any;
  if (typeof o !== "object") {
    return o;
  }
  if (!o) {
    return o;
  }
  if ("[object Array]" === Object.prototype.toString.apply(o)) {
    newO = [];
    for (i = 0; i < o.length; i += 1) {
      newO[i] = deepCopy(o[i]);
    }
    return newO;
  }
  newO = {};
  for (i in o) {
    if (o.hasOwnProperty(i)) {
      newO[i] = deepCopy(o[i]);
    }
  }
  return newO;
}

/**
 * Parse a object, if a key=>value is empty or undefined it will be removed from the object.
 *
 * @param obj
 *
 * @returns a cleaned object
 */
export function cleanObjectProperties(obj: any = {}) {
  const result: any = {};
  for (const key in obj) {
    if (obj[key] !== "" && obj[key] !== null && obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

/*
 |--------------------------------------------------------------------------------
 | DOM Utilities
 |--------------------------------------------------------------------------------
 */

/**
 * Updates the elements style attributes using fastom.mutate.
 *
 * @param element
 * @param styles
 * @param reset
 */
export function setStyle(element: any, styles: any, reset = false): void {
  fastdom.mutate(() => {
    if (reset) {
      element.setAttribute("style", "");
    }
    for (const key in styles) {
      element.style[key] = styles[key];
    }
  });
}

/**
 * Returns a transform: translate result based on the provided x,y,z values.
 * When you provide a z value it will return translate3d instead of translate.
 *
 * @param x
 * @param y
 * @param z
 *
 * @return translate values
 */
export function translate(x: number, y: number, z?: number): string {
  const posX = Math.round(x);
  const posY = Math.round(y);
  const posZ = z !== undefined ? Math.round(z) : undefined;
  if (posZ !== undefined) {
    return `translate3d(${posX}${posX !== 0 ? "px" : ""},${posY}${posY !== 0 ? "px" : ""},${posZ}${posZ !== 0 ? "px" : ""})`;
  }
  return `translate(${posX}${posX !== 0 ? "px" : ""},${posY}${posY !== 0 ? "px" : ""})`;
}

/*
 |--------------------------------------------------------------------------------
 | Pixi.js Utilities
 |--------------------------------------------------------------------------------
 */

/**
 * PixiJS Background Cover/Contain.
 *
 * @param viewport
 * @param sprite
 * @param type
 * @param forceSize
 */
export function setPixiBackground(viewport: { x: number; y: number }, sprite: any, type: "cover" | "contain" = "contain", forceSize?: any) {
  const sp = forceSize || { x: sprite.width, y: sprite.height };

  const winratio = viewport.x / viewport.y;
  const spratio = sp.x / sp.y;
  const pos = new PIXI.Point(0, 0);

  let scale = 1;
  if (type === "cover" ? winratio > spratio : winratio < spratio) {
    scale = viewport.x / sp.x;
    pos.y = -(sp.y * scale - viewport.y) / 2;
  } else {
    scale = viewport.y / sp.y;
    pos.x = -(sp.x * scale - viewport.x) / 2;
  }

  sprite.scale = new PIXI.Point(scale, scale);
  sprite.position = pos;
}

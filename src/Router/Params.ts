/*
 |--------------------------------------------------------------------------------
 | Params
 |--------------------------------------------------------------------------------
*/

export class Params {
  /**
   * Current parameter state.
   * @type {ParamsObject}
   */
  public readonly store: ParamsObject = {};

  /**
   * Creates a new 'Params' instance.
   *
   * @param params
   */
  constructor(params: ParamsObject = {}) {
    this.store = params;
  }

  /**
   * Returns the empty state of the current param store.
   *
   * @returns {boolean}
   */
  public isEmpty(): boolean {
    return Object.keys(this.store).length === 0;
  }

  /**
   * Returns a boolean state of the provided keys existence.
   *
   * @param key
   *
   * @returns {boolean}
   */
  public has(key: string): boolean {
    if (this.store[key] !== undefined) {
      return true;
    }
    return false;
  }

  /**
   * Returns value in provided key, or the entire params object.
   *
   * @param key
   *
   * @returns {ParamsObject | string}
   */
  public get(): ParamsObject;
  public get(key: string): string;
  public get(key?: string): ParamsObject | string {
    if (typeof key === "string") {
      return this.store[key];
    } else {
      return this.store;
    }
  }
}

/*
 |--------------------------------------------------------------------------------
 | Interfaces
 |--------------------------------------------------------------------------------
*/

interface ParamsObject {
  [key: string]: string;
}

/*
 |--------------------------------------------------------------------------------
 | State
 |--------------------------------------------------------------------------------
*/

export class State {
  /**
   * Current state.
   * @type {StateObject}
   */
  public readonly store: StateObject = {};

  /**
   * Creates a new 'State' instance.
   *
   * @param state
   */
  constructor(state: StateObject = {}) {
    this.store = state;
  }

  /**
   * Returns the empty state of the current state store.
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
   * Returns value in provided key, or the entire state object.
   *
   * @param key
   *
   * @returns {StateObject | any}
   */
  public get(): StateObject;
  public get(key: string): any;
  public get(key?: string): StateObject | any {
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

interface StateObject {
  [key: string]: any;
}

import { History } from "history";

/*
 |--------------------------------------------------------------------------------
 | Query
 |--------------------------------------------------------------------------------
*/

export class Query {
  /**
   * Browsers history instance.
   * @type {History}
   */
  public readonly history: History;

  /**
   * Current query state.
   * @type {QueryObject}
   */
  public store: QueryObject = {};

  /**
   * Creates a new 'Query' instance.
   *
   * @param history
   * @param search
   */
  constructor(history: History, search: string = "") {
    this.history = history;
    this.store = parse(search);
  }

  /**
   * Returns the empty state of the current query store.
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
    return this.store[key] ? true : false;
  }

  /**
   * Updates the current query store, and triggers a history push to the
   * new location.
   *
   * @param key
   * @param value
   *
   * @returns {void}
   */
  public set(key: string | QueryObject, value?: string | number): void {
    if (typeof key === "string") {
      this.store = {
        ...this.store,
        [key]: String(value)
      };
    } else {
      this.store = {
        ...this.store,
        ...key
      };
    }
    this.history.push({ search: this.toString() });
  }

  /**
   * Returns value in provided key, or the entire query object.
   *
   * @param key
   *
   * @returns {QueryObject | string}
   */
  public get(): QueryObject;
  public get(key: string): string;
  public get(key?: string): QueryObject | string {
    if (typeof key === "string") {
      return this.store[key];
    } else {
      return this.store;
    }
  }

  /**
   * Removes provided key => value pair from the query store and
   * triggers a history push to the new location.
   *
   * @param key
   *
   * @returns {void}
   */
  public unset(key?: string | string[]): void {
    if (key !== undefined) {
      const current: any = { ...this.store };
      if (Array.isArray(key)) {
        for (const k of key) {
          if (current[k] !== undefined) {
            delete current[k];
          }
        }
      } else {
        if (current[key] !== undefined) {
          delete current[key];
        }
      }
      this.store = current;
    } else {
      this.store = {};
    }
    this.history.push({ search: this.toString() });
  }

  /**
   * Replaces the entire query store with the new value.
   *
   * @param value
   *
   * @returns {void}
   */
  public replace(value: string | object): void {
    this.store = typeof value === "string" ? parse(value) : value || {};
    this.history.push({ search: this.toString() });
  }

  /**
   * Converts the current query store to a query string.
   *
   * @returns {string}
   */
  public toString(): string {
    const query: string[] = [];
    for (const key in this.store) {
      query.push(`${key}=${this.store[key]}`);
    }
    if (query.length) {
      return `?${query.join("&")}`;
    }
    return "";
  }
}

/*
 |--------------------------------------------------------------------------------
 | Helper Functions
 |--------------------------------------------------------------------------------
*/

/**
 * Converts a search string to a object key=>value pair.
 *
 * @param search
 */
function parse(search: string): any {
  const result: any = {};
  if (search) {
    search
      .replace("?", "")
      .split("&")
      .forEach(
        (filter: string): void => {
          const [key, val] = filter.split(/=(.+)/);
          result[key] = val;
        }
      );
  }
  return result;
}

/*
 |--------------------------------------------------------------------------------
 | Interfaces
 |--------------------------------------------------------------------------------
*/

interface QueryObject {
  [key: string]: string;
}

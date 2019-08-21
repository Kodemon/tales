import * as objectPath from "object-path";

import { Source } from "./Enums";
import { Page } from "./Page";
import { deepCopy, maybe } from "./Utils";

export class DataManager<Data = any> {
  /**
   * Page instance.
   * @type {Page}
   */
  public page: Page;

  /**
   * Data store.
   * @type {Data}
   */
  public data: Data;

  /**
   * Unique stack identifier.
   * @type {string}
   */
  get id() {
    return maybe(this.data, "id");
  }

  /**
   * Manually assigned name.
   * @type {string}
   */
  get name() {
    return maybe(this.data, "name", maybe(this.data, "type", this.id));
  }

  constructor(data: Data) {
    this.data = Object.freeze(data);
  }

  /*
   |--------------------------------------------------------------------------------
   | Emitter
   |--------------------------------------------------------------------------------
   */

  public send(path: string, value: any) {
    throw new Error(`${this.constructor.name} has not defined a .send(path: string, value: any) method, make sure you have defined a send handler for this class.`);
  }

  /*
   |--------------------------------------------------------------------------------
   | Setters
   |--------------------------------------------------------------------------------
   */

  /**
   * Set a new data value at the provided path.
   *
   * @param path
   * @param value
   * @param source
   */
  public set(path: string, value: any, source: Source = Source.Silent) {
    const data = deepCopy(this.data);

    if (value === undefined || value === null || value === "") {
      objectPath.del(data, path);
    } else {
      objectPath.set(data, path, value);
    }

    this.data = Object.freeze(data);

    this.page.cache();

    this.render();

    this.page.emit("refresh");

    if (source === Source.User) {
      this.send(path, value);
    }
  }

  /**
   * Set a setting value at the provided path.
   *
   * @param path
   * @param value
   * @param source
   */
  public setSetting(path: string, value: any, source?: Source) {
    this.set(`settings.${path}`, value, source);
  }

  /**
   * Set a new style value.
   *
   * @param key
   * @param value
   * @param source
   */
  public setStyle(key: string, value: any, source?: Source) {
    this.set(`style.${key}`, value, source);
  }

  /*
   |--------------------------------------------------------------------------------
   | Getters
   |--------------------------------------------------------------------------------
   */

  /**
   * Get a value from data at the given path, optionally a fallback value can be
   * provided if no value exists.
   *
   * @param path
   * @param fallback
   */
  public get(path: string, fallback?: any) {
    return maybe(this.data, path, fallback);
  }

  /**
   * Get a setting value at the provided path, optionally a fallback value can be
   * provided if no value exists.
   *
   * @param path
   * @param fallback
   */
  public getSetting(path: string, fallback?: any) {
    return this.get(`settings.${path}`, fallback);
  }

  /**
   * Get a style value, optionally a fallback value can be provided if no value
   * exists.
   *
   * @param path
   * @param fallback
   */
  public getStyle(key: string, fallback?: any) {
    return this.get(`style.${key}`, fallback);
  }

  /*
   |--------------------------------------------------------------------------------
   | Rendering
   |--------------------------------------------------------------------------------
   */

  public render() {
    throw new Error(`${this.constructor.name} has not defined a .render() method, make sure you have defined a send handler for this class.`);
  }
}

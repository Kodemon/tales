import { cleanObjectProperties, deepCopy, maybe } from "Engine/Utils";

import { Section } from "../Section";

export class Component {
  /**
   * Section this image renders within.
   * @type {section}
   */
  public section: Section;

  /**
   * Data attributes of the component.
   * @type {any}
   */
  public data: any;

  /**
   * Component type.
   * @type {string}
   */
  get type() {
    return this.data.type;
  }

  /**
   * Component id.
   * @type {string}
   */
  get id() {
    return this.data.id;
  }

  constructor(section: Section, data: any) {
    this.section = section;
    this.data = Object.freeze(data);
  }

  /**
   * Sets the new component data values.
   *
   * @param data
   */
  public setData(data: any) {
    this.data = Object.freeze(data);
  }

  /**
   * Return the item title, default behavior returns the component
   * type as the title.
   *
   * @returns component title
   */
  public getTitle() {
    return this.type;
  }

  /**
   * Update a component key => value.
   *
   * @param key
   * @param value
   * @param isSource
   */
  public set(key: string, value: any, isSource = false) {
    const section = deepCopy(this.section.data);
    section.components = section.components.map((component: any) => {
      if (component.id === this.id) {
        component[key] = value;
      }
      return component;
    });
    this.section.commit(section, this.id);
    if (isSource) {
      this.section.page.conduit.send("component:set", section.id, this.id, key, value);
    }
  }

  /**
   * Return a component data value or a optional fallback,
   *
   * @param key
   * @param fallback
   *
   * @returns setting value
   */
  public get(key: string, fallback?: any) {
    return maybe(this.data, key, fallback);
  }

  /**
   * Update a component key => value setting.
   *
   * @param key
   * @param value
   * @param isSource
   */
  public setSetting(key: string, value: any, isSource = false) {
    const section = deepCopy(this.section.data);
    section.components = section.components.map((component: any) => {
      if (component.id === this.id) {
        component.settings = cleanObjectProperties({
          ...maybe(this.data, "settings", {}),
          [key]: value
        });
      }
      return component;
    });
    this.section.commit(section, this.id);
    if (isSource) {
      this.section.page.conduit.send("component:setting", section.id, this.id, key, value);
    }
  }

  /**
   * Return a component setting value or a optional fallback,
   *
   * @param key
   * @param fallback
   *
   * @returns setting value
   */
  public getSetting(key: string, fallback?: any) {
    return maybe(this.data, ["settings", key], fallback);
  }

  /**
   * Update a component key => value style.
   *
   * @param key
   * @param value
   * @param isSource
   */
  public setStyle(key: string, value: any, isSource = false) {
    const section = deepCopy(this.section.data);
    section.components = section.components.map((component: any) => {
      if (component.id === this.id) {
        component.style = cleanObjectProperties({
          ...maybe(this.data, "style", {}),
          [key]: value
        });
      }
      return component;
    });
    this.section.commit(section, this.id);
    if (isSource) {
      this.section.page.conduit.send("component:style", section.id, this.id, key, value);
    }
  }

  /**
   * Return a component style value or a optional fallback,
   *
   * @param key
   * @param fallback
   *
   * @returns style value
   */
  public getStyle(key: string, fallback?: any) {
    return maybe(this.data, ["style", key], fallback);
  }
}

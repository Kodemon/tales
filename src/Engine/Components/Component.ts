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

  /**
   * Page instance.
   * @type {Page}
   */
  get page() {
    return this.section.page;
  }

  /**
   * Edit state of the page.
   * @type {boolean}
   */
  get editing() {
    return this.page.editing;
  }

  constructor(section: Section, data: any) {
    this.section = section;
    this.data = Object.freeze(data);
  }

  /*
  |--------------------------------------------------------------------------------
  | Data Utilties
  |--------------------------------------------------------------------------------
  */

  /**
   * Return the item title, default behavior returns the component
   * type as the title.
   *
   * @returns component title
   */
  public getTitle() {
    return this.type;
  }

  /*
  |--------------------------------------------------------------------------------
  | Data Utilities
  |--------------------------------------------------------------------------------
  */

  /**
   * Replaces the data parameter with the provided data.
   *
   * @param data
   */
  public setData(data: any) {
    this.data = Object.freeze(data);
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
      this.page.send("component:set", section.id, this.id, key, value);
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
      this.page.send("component:setting", section.id, this.id, key, value);
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
      this.page.send("component:style", section.id, this.id, key, value);
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

  /*
  |--------------------------------------------------------------------------------
  | Removal Utilties
  |--------------------------------------------------------------------------------
  */

  /**
   * Removes the component from the page.
   *
   * @param isSource
   */
  public remove(isSource = false) {
    const element = this.section.elements.get(this.id);
    if (element) {
      this.section.elements.delete(this.id);
      element.remove();
    }

    this.section.components = this.section.components.reduce((components: any[], component: any) => {
      if (component.id !== this.id) {
        components.push(component);
      }
      return components;
    }, []);

    const section = deepCopy(this.section.data);
    section.components = section.components.reduce((components: any[], component: any) => {
      if (component.id !== this.id) {
        components.push(component);
      }
      return components;
    }, []);
    this.section.commit(section);

    if (isSource) {
      this.page.send("component:removed", section.id, this.id);
    }
  }
}

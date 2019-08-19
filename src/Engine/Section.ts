import * as rndm from "rndm";

import { Image } from "./Components/Image";
import { Overlay } from "./Components/Overlay";
import { Reveal } from "./Components/Reveal";
import { Text } from "./Components/Text";
import { Page } from "./Page";
import { maybe, setStyle } from "./Utils";
import { viewport } from "./Viewport";

export class Section {
  /**
   * Page to render the section within.
   * @type {Page}
   */
  public page: Page;

  /**
   * Section container element.
   * @type {HTMLElement}
   */
  public container: HTMLElement;

  /**
   * Scene height in pixels, used to determine min height.
   * @type {height}
   */
  public height: number = 0;

  /**
   * Section schema.
   * @type {SectionData}
   */
  public data: SectionData;

  /**
   * List of components living under this section.
   * @type {any[]}
   */
  public components: any[] = [];

  /**
   * Map of rendered elements, used during re-renders requests
   * to replace a specific elements.
   * @type {Map<string, any>}
   */
  public elements: Map<string, any> = new Map();

  /**
   * @param page
   * @param data
   */
  constructor(page: Page, data: SectionData) {
    this.page = page;
    this.container = document.createElement("section");

    this.setData(data);
    this.setStyle();

    page.container.append(this.container);
  }

  /**
   * Section id.
   * @type {string}
   */
  get id() {
    return this.data.id;
  }

  /*
  |--------------------------------------------------------------------------------
  | Section Setting Utilities
  |--------------------------------------------------------------------------------
  */

  /**
   * Set a scene setting.
   *
   * @param key
   * @param value
   * @param isSource
   */
  public setSetting(key: SectionSetting, value: any, isSource = false) {
    const data = { ...this.data };
    data.settings[key] = value;
    this.commit(data);
    if (isSource) {
      this.page.send("section:setting", this.data.id, key, value);
    }
  }

  /**
   * Get a scene setting.
   *
   * @param key
   */
  public getSetting(key: SectionSetting) {
    return maybe(this.data, `settings.${key}`);
  }

  /*
  |--------------------------------------------------------------------------------
  | Component Utilities
  |--------------------------------------------------------------------------------
  */

  /**
   * Adds the provided component to the section component list.
   *
   * @param component
   */
  public addComponent(component: any, isSource = false) {
    const section = { ...this.data };
    const data = {
      id: rndm.base62(10),
      ...component
    };
    section.components.push(data);
    this.commit(section, data.id);
    if (isSource) {
      this.page.send("component:added", section.id, data);
    }
    this.page.emit("edit", this, this.components.find(c => c.id === data.id));
  }

  /*
  |--------------------------------------------------------------------------------
  | Storage Utilities
  |--------------------------------------------------------------------------------
  */

  /**
   * @should format section data
   * @should set data to the section
   * @should adjust section style
   * @should render section
   * @should persist the section data
   * @should emit section update
   *
   * @param obj
   */
  public commit(obj: any, componentId?: string) {
    const data = getSection(obj);

    this.setData(data);
    this.setStyle();

    this.render(componentId);

    this.page.cache();
    this.page.emit("section", this);
  }

  /*
  |--------------------------------------------------------------------------------
  | Render Utilities
  |--------------------------------------------------------------------------------
  */

  /**
   * Adds the given element to the scene.
   *
   * @param componentId
   * @param nextElement
   */
  public append(componentId: string, nextElement: any) {
    const currentElement = this.elements.get(componentId);
    if (currentElement) {
      this.container.replaceChild(nextElement, currentElement);
    } else {
      this.container.append(nextElement);
    }
    this.elements.set(componentId, nextElement);
  }

  /**
   * Renders the scene to the dom.
   *
   * @param componentId
   */
  public render(componentId?: string) {
    for (const component of this.components) {
      if (componentId && componentId !== component.id) {
        continue;
      }
      component.render();
    }
    return this;
  }

  /*
  |--------------------------------------------------------------------------------
  | Private Utilities
  |--------------------------------------------------------------------------------
  */

  /**
   * Set the scene properties onto the instance.
   *
   * @param scene
   */
  private setData(data: SectionData) {
    const height = maybe<number>(data, "settings.height", 0);
    if (height > 0) {
      this.height = viewport.height * height;
    } else {
      this.height = 0;
    }

    for (const component of data.components) {
      const current = this.components.find(c => c.id === component.id);
      if (current) {
        current.setData(component);
      } else {
        switch (component.type) {
          case "image": {
            this.components.push(new Image(this, component));
            break;
          }
          case "text": {
            this.components.push(new Text(this, component));
            break;
          }
          case "overlay": {
            this.components.push(new Overlay(this, component));
            break;
          }
          case "reveal": {
            this.components.push(new Reveal(this, component));
            break;
          }
        }
      }
    }

    this.data = data;
  }

  /**
   * Sets the style of the section based on its settings.
   */
  private setStyle() {
    const position = maybe<string>(this.data, "settings.position", "relative");
    const background = maybe<string>(this.data, "settings.background", "#fff");

    switch (position) {
      case "relative": {
        this.container.className = "section-relative";
        break;
      }
      case "sticky": {
        this.container.className = "section-sticky";
        break;
      }
      case "absolute": {
        this.container.className = "section-absolute";
        break;
      }
    }

    setStyle(this.container, {
      background,
      minHeight: this.height
    });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

/**
 * Gets a section in its raw data form as a immutable object.
 *
 * @param data
 *
 * @returns immutable section data
 */
export function getSection(data: any = {}): Readonly<SectionData> {
  return Object.freeze({
    id: data.id || rndm.base62(10),
    settings: {
      background: "#fff",
      position: "relative",
      height: 1,
      ...(data.settings || {})
    },
    components: data.components || []
  });
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type SectionSetting = "background" | "position" | "height";

/*
 |--------------------------------------------------------------------------------
 | Interfaces
 |--------------------------------------------------------------------------------
 */

export interface SectionData {
  /**
   * Unique section identifier.
   * @type {string}
   */
  id: string;

  /**
   * Section settings.
   * @type {SectionSettings}
   */
  settings: SectionSettings;

  /**
   * Section components.
   * @type {any[]}
   */
  components: any[];
}

interface SectionSettings {
  /**
   * Background color of the scene.
   * @type {string}
   */
  background?: string;

  /**
   * CSS position of the scene element.
   * @type {"relative" | "sticky" | "absolute"}
   */
  position?: "relative" | "sticky" | "absolute";

  /**
   * Height relative to current viewport in decimal. Eg. 1 is the full height
   * of the viewport. This is used to determine the minimum height of the
   * scene.
   * @type {number}
   */
  height?: number;
}

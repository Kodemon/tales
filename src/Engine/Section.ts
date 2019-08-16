import * as rndm from "rndm";
import * as ScrollMagic from "scrollmagic";

import { Image } from "./Components/Image";
import { Text } from "./Components/Text";
import { Page } from "./Page";
import { cleanObjectProperties, maybe, setStyle } from "./Utils";

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
   * ScrollMagic scene.
   * @type {ScrollMagic.Scene}
   */
  public scroll: typeof ScrollMagic.Scene;

  /**
   * List of components living under this section.
   * @type {any[]}
   */
  public components: any[] = [];

  /**
   * Section schema.
   * @type {SectionData}
   */
  public data: SectionData;

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

    this.scroll = new ScrollMagic.Scene({
      triggerElement: this.container,
      triggerHook: 1,
      reverse: true
    });
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
  | Setting Utilities
  |--------------------------------------------------------------------------------
  */

  /**
   * Set a scene setting.
   *
   * @param key
   * @param value
   * @param isSource
   */
  public set(key: SectionSetting, value: any, isSource = false) {
    const scene = { ...this.data };
    scene.settings[key] = value;
    this.commit(scene);
    if (isSource) {
      this.page.conduit.send("section:setting", this.data.id, key, value);
    }
  }

  /**
   * Get a scene setting.
   *
   * @param key
   */
  public get(key: SectionSetting) {
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
    this.commit(section);
    if (isSource) {
      this.page.conduit.send("component:added", section.id, data);
    }
  }

  /**
   * Updates the provided component, and commits it to the session.
   *
   * @param component
   */
  public updateComponent(component: any) {
    const section = { ...this.data };
    section.components = section.components.map((c: any) => {
      if (c.id === component.id) {
        return component;
      }
      return c;
    });
    this.commit(section);
  }

  /**
   * Removes the provided component from the scene.
   *
   * @param id
   * @param isSource
   */
  public removeComponent(id: string, isSource = false) {
    const section = { ...this.data };
    section.components = section.components.reduce((components: any[], component: any) => {
      if (component.id !== id) {
        components.push(component);
      }
      return components;
    }, []);
    this.commit(section);
    if (isSource) {
      this.page.conduit.send("component:removed", section.id, id);
    }
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
  public commit(obj: any) {
    const data = getSection(obj);

    this.setData(data);
    this.setStyle();

    this.render();

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
   * @param element
   */
  public append(element: any) {
    this.container.append(element);
  }

  /**
   * Renders the scene to the dom.
   */
  public render() {
    this.container.innerHTML = "";

    for (const component of this.components) {
      component.render();
    }

    const loader = setInterval(() => {
      if (this.container.offsetHeight !== 0) {
        this.scroll.duration(this.container.offsetHeight);
        this.scroll.addTo(this.page.controller);
        clearInterval(loader);
      }
    }, 100);

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
    this.components = [];

    const height = maybe<number>(data, "settings.height", 0);
    if (height > 0) {
      this.height = this.page.viewport.height * height;
    } else {
      this.height = 0;
    }

    for (const component of data.components) {
      switch (component.type) {
        case "image": {
          this.components.push(new Image(this, component));
          break;
        }
        case "text": {
          this.components.push(new Text(this, component));
          break;
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

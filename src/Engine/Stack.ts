import * as rndm from "rndm";

import { Gallery } from "./Components/Gallery";
import { Image } from "./Components/Image";
import { Overlay } from "./Components/Overlay";
import { Reveal } from "./Components/Reveal";
import { Text } from "./Components/Text";
import { DataManager } from "./DataManager";
import { Source } from "./Enums";
import { Section } from "./Section";
import { setStyle } from "./Utils";

export class Stack extends DataManager<Data> {
  /**
   * Section the stack belongs to.
   */
  public section: Section;

  /**
   * Stack DOM element.
   * @type {HTMLDivElement}
   */
  public element: HTMLDivElement;

  /**
   * List of instanced components to render in the stack.
   * @type {any[]}
   */
  public components: any[] = [];

  /**
   * Page instance the stack is rendered within.
   * @type {Page}
   */
  get page() {
    return this.section.page;
  }

  constructor(section: Section, data: any) {
    super(data);

    this.section = section;
    this.section.element.append((this.element = document.createElement("div")));

    for (const data of this.data.components) {
      const Component = this.getComponent(data.type);
      if (Component) {
        const component = new Component(this, data);
        this.components.push(component);
        component.render();
      }
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | JSON
   |--------------------------------------------------------------------------------
   */

  public toJSON() {
    return {
      ...this.data,
      components: this.components.map(component => component.data)
    };
  }

  /*
   |--------------------------------------------------------------------------------
   | Emitter
   |--------------------------------------------------------------------------------
   */

  /**
   * Sends a stack set operation to all connected peers.
   *
   * @param path
   * @param value
   */
  public send(path: string, value: any) {
    this.page.send("stack:set", this.page.id, this.section.id, this.id, path, value);
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
  public addComponent(data: any, source: Source = Source.Silent) {
    const Component = this.getComponent(data.type);
    if (Component) {
      const component = new Component(this, {
        id: rndm.base62(10),
        type: data.type,
        area: data.area || "",
        name: data.name,
        settings: data.settings || {},
        style: data.style || {}
      });

      this.components.push(component);

      component.render();

      this.page.cache();

      if (source === Source.User) {
        this.page.send("component:added", this.page.id, this.section.id, this.id, component.data);
      }

      return component;
    }
  }

  /**
   * Get a component class based on provided type.
   *
   * @param type
   *
   * @returns component class
   */
  public getComponent(type: any) {
    switch (type) {
      case "text": {
        return Text;
      }
      case "overlay": {
        return Overlay;
      }
      case "image": {
        return Image;
      }
      case "gallery": {
        return Gallery;
      }
      case "reveal": {
        return Reveal;
      }
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | Render Utilities
   |--------------------------------------------------------------------------------
   */

  public render() {
    const position = this.getSetting("position", "relative");
    switch (position) {
      case "relative": {
        this.element.className = "section-relative";
        break;
      }
      case "sticky": {
        this.element.className = "section-sticky";
        break;
      }
      case "absolute": {
        this.element.className = "section-absolute";
        break;
      }
    }

    setStyle(this.element, {
      ...(this.data.style || {}),
      minHeight: this.section.getHeight()
    });

    for (const component of this.components) {
      component.render();
    }
  }
}

/*
 |--------------------------------------------------------------------------------
 | Interfaces
 |--------------------------------------------------------------------------------
 */

interface Data {
  /**
   * Unique stack identifier.
   * @type {string}
   */
  id: string;

  /**
   * Manually assigned stack name.
   * @type {string}
   */
  name: string;

  /**
   * Stack settings.
   * @type {any}
   */
  settings: Settings;

  /**
   * Stack style.
   * @type {any}
   */
  style?: any;

  /**
   * List of stack components.
   * @type {any[]}
   */
  components: any[];
}

interface Settings {
  /**
   * Stack grid configuration.
   * @type {any}
   */
  layout: any;
}

import { DataManager } from "./DataManager";
import { Stack } from "./Stack";
import { setStyle } from "./Utils";

export class Component extends DataManager<Data> {
  /**
   * Stack this image renders within.
   * @type {section}
   */
  public stack: Stack;

  /**
   * Root component element.
   * @type {HTMLDivElement}
   */
  public area: HTMLDivElement;

  /**
   * Component type.
   * @type {string}
   */
  get type() {
    return this.data.type;
  }

  /**
   * Page instance.
   * @type {Page}
   */
  get page() {
    return this.stack.page;
  }

  /**
   * Section instance.
   * @type {Section}
   */
  get section() {
    return this.stack.section;
  }

  /**
   * Editing state of the engine.
   * @type {boolean}
   */
  get editing() {
    return this.page.editing;
  }

  constructor(stack: Stack, data: any) {
    super(data);
    this.stack = stack;
    this.area = document.createElement("div");

    switch (this.getSetting("position", "relative")) {
      case "absolute": {
        setStyle(this.area, {
          gridArea: this.id
        });
        break;
      }
      case "sticky": {
        this.area.className = "position-sticky";
        setStyle(this.area, {
          gridArea: this.id
        });
        break;
      }
      default: {
        setStyle(this.area, {
          gridArea: this.id,
          position: "relative",
          minWidth: "100%",
          minHeight: "100%"
        });
      }
    }

    this.stack.element.append(this.area);
  }

  /*
   |--------------------------------------------------------------------------------
   | Emitter
   |--------------------------------------------------------------------------------
   */

  /**
   * Sends a component set operation to all connected peers.
   *
   * @param path
   * @param value
   */
  public send(path: string, value: any) {
    this.page.send("component:set", this.page.id, this.section.id, this.stack.id, this.id, path, value);
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
    /*
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
    */
  }
}

/*
 |--------------------------------------------------------------------------------
 | Interfaces
 |--------------------------------------------------------------------------------
 */

interface Data {
  /**
   * Component type.
   * @type {string}
   */
  type: string;

  /**
   * Unique component identifier.
   * @type {string}
   */
  id: string;

  /**
   * Component grid area within the stack.
   * @type {string}
   */
  area: string;

  /**
   * Manually assigned component name.
   * @type {string}
   */
  name?: string;

  /**
   * Component settings.
   * @type {any}
   */
  settings?: any;

  /**
   * Component style.
   * @type {any}
   */
  style?: any;
}

import { DataManager } from "./DataManager";
import { Source } from "./Enums";
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
    this.area.setAttribute("data-type", `${this.type}-component`);
    this.area.onclick = () => {
      this.edit();
    };

    setStyle(this.area, { pointerEvents: "none" });

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

  /**
   * Sends a edit assignment to the editor via page events.
   */
  public edit() {
    this.page.emit("edit", this.section.id, this.stack.id, this.id);
  }

  /*
   |--------------------------------------------------------------------------------
   | Removal Utilties
   |--------------------------------------------------------------------------------
   */

  /**
   * Removes the component from the stack.
   *
   * @param source
   */
  public remove(source: Source = Source.Silent) {
    this.stack.components = this.stack.components.reduce((components: Component[], component: Component) => {
      if (component.id !== this.id) {
        components.push(component);
      } else {
        component.area.remove();
      }
      return components;
    }, []);

    this.page.cache();
    this.page.emit("refresh");
    this.page.emit("edit");

    if (source === Source.User) {
      this.page.emit("component:remove", this.page.id, this.section.id, this.stack.id, this.id);
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | Rendering
   |--------------------------------------------------------------------------------
   */

  public render() {
    switch (this.getSetting("position", "relative")) {
      case "absolute": {
        this.area.className = "position-absolute";
        setStyle(this.area, {
          gridArea: this.id,
          width: "100%",
          height: "100%"
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
      case "fixed": {
        this.area.className = "position-fixed";
        setStyle(this.area, {
          gridArea: this.id
        });
        break;
      }
      default: {
        this.area.className = "position-relative";
        setStyle(this.area, {
          gridArea: this.id,
          minWidth: "100%"
        });
      }
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

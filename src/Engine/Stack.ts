import { template } from "../App/Editor/Components/StackLayout/Parser/Template";
import { Gallery } from "./Components/Gallery";
import { Image } from "./Components/Image";
import { Overlay } from "./Components/Overlay";
import { Reveal } from "./Components/Reveal";
import { Text } from "./Components/Text";
import { Vimeo } from "./Components/Vimeo";
import { YouTube } from "./Components/YouTube";
import { DataManager } from "./DataManager";
import { Source } from "./Enums";
import { Section } from "./Section";
import { generateId, setStyle } from "./Utils";
import { viewport } from "./Viewport";

const DEFAULT_GRID = {
  width: 1,
  height: 0,
  areas: {}
};

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
    this.element.id = data.id;
    this.element.setAttribute("data-type", "stack");

    for (const data of this.data.components) {
      const Component = this.getComponentClass(data.type);
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

  /**
   * Sends a edit assignment to the editor via page events.
   */
  public edit() {
    this.page.emit("edit", this.section.id, this.id, "");
  }

  /*
  |--------------------------------------------------------------------------------
  | Stack Utilities
  |--------------------------------------------------------------------------------
  */

  public remove(source: Source = Source.Silent) {
    this.section.stacks = this.section.stacks.reduce((stacks: Stack[], stack: Stack) => {
      if (stack.id !== this.id) {
        stacks.push(stack);
      } else {
        stack.element.remove();
      }
      return stacks;
    }, []);

    this.page.cache();
    this.page.emit("refresh");
    this.page.emit("edit");

    if (source === Source.User) {
      this.page.emit("stack:remove", this.page.id, this.section.id, this.id);
    }
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
    const Component = this.getComponentClass(data.type);
    if (Component) {
      const id = data.id || generateId(5, "c");
      const component = new Component(this, {
        id,
        type: data.type,
        area: data.area || "",
        name: data.name,
        settings: data.settings || {},
        style: data.style || {}
      });

      const grid = this.getSetting("grid", DEFAULT_GRID);
      this.setSetting("grid", {
        width: grid.width,
        height: grid.height + 1,
        areas: {
          ...grid.areas,
          [id]: {
            column: { start: 1, end: grid.width + 1, span: grid.width },
            row: { start: grid.height + 1, end: grid.height + 2, span: 1 }
          }
        }
      });

      this.components.push(component);
      component.render();

      this.page.cache();
      this.page.emit("refresh");

      if (source === Source.User) {
        this.page.send("component:added", this.page.id, this.section.id, this.id, component.data);
      }

      return component;
    }
  }

  /**
   * Get a component from the stack.
   *
   * @param id
   *
   * @returns component instance
   */
  public getComponent(id: string) {
    return this.components.find(c => c.id === id);
  }

  /**
   * Get the raw component data from the stack.
   *
   * @param id
   */
  public getComponentData(id: string) {
    return this.data.components.find(c => c.id === id);
  }

  /**
   * Get a component class based on provided type.
   *
   * @param type
   *
   * @returns component class
   */
  public getComponentClass(type: any) {
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
      case "youTube": {
        return YouTube;
      }
      case "vimeo": {
        return Vimeo;
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
        this.element.className = "position-relative";
        break;
      }
      case "sticky": {
        this.element.className = "position-sticky";
        break;
      }
      case "absolute": {
        this.element.className = "position-absolute";
        break;
      }
    }

    const grid = this.getSetting("grid");
    const gridStyle: any = {};
    if (grid) {
      gridStyle.display = "grid";
      gridStyle.gridTemplateColumns = "auto ".repeat(grid.width).trim();
      gridStyle.gridTemplateRows = "auto ".repeat(grid.height).trim();
      gridStyle.gridTemplateAreas = template(grid);
    }

    setStyle(this.element, {
      ...(this.data.style || {}),
      ...gridStyle,
      width: viewport.width,
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

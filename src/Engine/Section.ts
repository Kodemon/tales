import * as rndm from "rndm";

import { DataManager } from "./DataManager";
import { Source } from "./Enums";
import { Page } from "./Page";
import { Stack } from "./Stack";
import { setStyle } from "./Utils";
import { viewport } from "./Viewport";

export class Section extends DataManager<Data> {
  /**
   * Page to render the section within.
   * @type {Page}
   */
  public page: Page;

  /**
   * Section container element.
   * @type {HTMLElement}
   */
  public element: HTMLElement;

  /**
   * Section height in pixels, used to determine min height.
   * @type {height}
   */
  public height: number = 0;

  /**
   * List of stacks living under this section.
   * @type {Stack[]}
   */
  public stacks: Stack[] = [];

  constructor(page: Page, data: Data) {
    super(data);

    this.page = page;
    this.page.element.append((this.element = document.createElement("section")));

    for (const data of this.data.stacks) {
      const stack = new Stack(this, data);
      this.stacks.push(stack);
      stack.render();
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
      stacks: this.stacks.map(stack => stack.toJSON())
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
    this.page.send("section:set", this.page.id, this.id, path, value);
  }

  /*
  |--------------------------------------------------------------------------------
  | Stack Utilities
  |--------------------------------------------------------------------------------
  */

  /**
   * Adds the provided component to the section component list.
   *
   * @param component
   */
  public addStack(data: any, source: Source = Source.Silent) {
    const stack = new Stack(this, {
      id: data.id || rndm.base62(10),
      name: data.name,
      settings: data.settings || {},
      style: data.style || {},
      components: data.components || []
    });

    this.stacks.push(stack);

    stack.render();

    this.page.cache();

    if (source === Source.User) {
      this.page.send("stack:added", this.page.id, this.id, stack.data);
    }

    return stack;
  }

  /*
  |--------------------------------------------------------------------------------
  | Calculation Utilities
  |--------------------------------------------------------------------------------
  */

  public getHeight() {
    const height = this.getSetting("height", 1);
    if (height > 0) {
      return viewport.height * height;
    } else {
      return 0;
    }
  }

  /*
  |--------------------------------------------------------------------------------
  | Render Utilities
  |--------------------------------------------------------------------------------
  */

  public render() {
    const position = this.getSetting("position", "relative");
    const background = this.getSetting("background", "white");

    this.height = this.getHeight();

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
      background,
      minHeight: this.height
    });

    for (const stack of this.stacks) {
      stack.render();
    }
  }
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

export interface Data {
  /**
   * Unique section identifier.
   * @type {string}
   */
  id: string;

  /**
   * Section settings.
   * @type {SectionSettings}
   */
  settings?: SectionSettings;

  /**
   * Section stacks.
   * @type {any[]}
   */
  stacks: any[];
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

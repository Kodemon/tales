import * as rndm from "rndm";

import { DataManager } from "./DataManager";
import { Source } from "./Enums";
import { Page, PageConduitEvent, PageEvent } from "./Page";
import { Stack } from "./Stack";
import { insertElementAfter, moveArrayIndex, setStyle } from "./Utils";
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
    this.element.id = data.id;

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
    this.page.send(PageConduitEvent.SectionSet, this.page.id, this.id, path, value);
  }

  /**
   * Sends a edit assignment to the editor via page events.
   */
  public edit() {
    this.page.emit(PageEvent.Edit, this.id);
  }

  /*
  |--------------------------------------------------------------------------------
  | Section Utilities
  |--------------------------------------------------------------------------------
  */

  public remove(source: Source = Source.Silent) {
    this.page.sections = this.page.sections.reduce((sections: Section[], section: Section) => {
      if (section.id !== this.id) {
        sections.push(section);
      } else {
        section.element.remove();
      }
      return sections;
    }, []);

    this.page.cache();
    this.page.emit(PageEvent.Refresh);

    if (source === Source.User) {
      this.page.send(PageConduitEvent.SectionRemoved, this.page.id, this.id);
      this.page.emit(PageEvent.Edit);
    }
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
    this.page.emit(PageEvent.Refresh);

    if (source === Source.User) {
      this.page.send(PageConduitEvent.StackAdded, this.page.id, this.id, stack.data);
      this.page.emit(PageEvent.Edit, this.id, stack.id);
    }

    return stack;
  }

  /**
   * Get a stack from the section.
   *
   * @param id
   *
   * @returns stack instance
   */
  public getStack(id: string) {
    return this.stacks.find(c => c.id === id);
  }

  /**
   * Get the raw stack data from the section.
   *
   * @param id
   *
   * @returns stack data
   */
  public getStackData(id: string) {
    return this.data.stacks.find(c => c.id === id);
  }

  /**
   * Moves a stack to a new position on the section.
   *
   * @param prevIndex
   * @param nextIndex
   */
  public moveStack(prevIndex: number, nextIndex: number, source: Source = Source.Silent) {
    if (prevIndex === nextIndex) {
      return; // no need to update, indexes are the same
    }

    const stackA = this.stacks[prevIndex];
    if (!stackA) {
      return console.error(`Move Stack > Could not find the source stack at index position ${prevIndex}.`);
    }

    const stackB = this.stacks[nextIndex];
    if (!stackB) {
      return console.error(`Move Stack > Could not find the destination stack at index position ${nextIndex}.`);
    }

    this.stacks = moveArrayIndex(this.stacks, prevIndex, nextIndex);
    this.page.cache();

    if (prevIndex > nextIndex) {
      this.element.insertBefore(stackA.element, stackB.element);
    } else {
      insertElementAfter(stackA.element, stackB.element);
    }

    this.page.emit(PageEvent.Refresh);

    if (source === Source.User) {
      this.page.send(PageConduitEvent.StackMoved, this.id, prevIndex, nextIndex);
    }
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

    setStyle(this.element, {
      background,
      minHeight: this.height,
      width: viewport.width
    });

    for (const stack of this.stacks) {
      stack.render();
    }
  }
}

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

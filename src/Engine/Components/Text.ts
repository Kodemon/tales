import { getSection } from "Engine/Section";

import { deepCopy, maybe, setStyle } from "../Utils";
import { Component } from "./Component";

export class Text extends Component {
  /**
   * Text container element.
   * @type {HTMLDivElement}
   */
  public grid: HTMLDivElement;

  /**
   * Quill instance passed by the editor.
   * @type {Quill}
   */
  public quill: any;

  /**
   * Return text title.
   *
   * @returns partial quill text or "Text"
   */
  public getTitle() {
    if (this.quill) {
      return `${this.quill.getText(0, 20)}`;
    }
    return "Text";
  }

  /**
   * Updates the component.
   *
   * @param key
   * @param param1
   * @param isSource
   */
  public set(key: string, { content, delta }: any, isSource = false) {
    const section = deepCopy(this.section.data);
    section.components = section.components.map((component: any) => {
      if (component.id === this.id) {
        component[key] = content;
      }
      return component;
    });

    this.section.data = getSection(section);
    this.section.page.cache();

    if (!isSource) {
      this.quill.updateContents(delta);
    }
  }

  /**
   * Outputs the article container element, in read mode it also renders out the
   * html output within the container.
   */
  public render() {
    this.grid = document.createElement("div");
    this.grid.className = "tale-text";
    setStyle(this.grid, {
      ...getGridLayout(maybe<string>(this.data, "settings.layout"), maybe<number>(this.data, "settings.min"), maybe<number>(this.data, "settings.max")),
      minHeight: this.section.height
    });
    if (maybe<boolean>(this.data, "settings.sticky", false)) {
      setStyle(this.grid, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%"
      });
    }
    this.section.append(this.id, this.grid);
  }
}

/**
 * Retrieve grid layout for the text.
 *
 * @param layout
 */
function getGridLayout(layout: string = "middle", min: number = 280, max: number = 580): any {
  switch (layout) {
    case "left": {
      return {
        display: "grid",
        gridTemplateColumns: `minmax(${min}px, ${max}px) auto`,
        gridTemplateRows: "auto 1fr",
        gridTemplateAreas: "'toolbar toolbar' 'text .'"
      };
    }
    case "middle": {
      return {
        display: "grid",
        gridTemplateColumns: `auto minmax(${min}px, ${max}px) auto`,
        gridTemplateRows: "auto 1fr",
        gridTemplateAreas: "'toolbar toolbar toolbar' '. text .'"
      };
    }
    case "right": {
      return {
        display: "grid",
        gridTemplateColumns: `auto minmax(${min}px, ${max}px)`,
        gridTemplateRows: "auto 1fr",
        gridTemplateAreas: "'toolbar toolbar' '. text'"
      };
    }
    case "center": {
      return {
        display: "grid",
        gridTemplateColumns: `auto minmax(${min}px, ${max}px) auto`,
        gridTemplateRows: "auto 1fr auto 1fr",
        gridTemplateAreas: "'toolbar toolbar toolbar' '. . .' '. text .' '. . .'"
      };
    }
  }
}

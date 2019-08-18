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
   * Quill editors body element.
   * @type {HTMLElement}
   */
  public body: HTMLElement;

  public setQuill(quill: any, body: HTMLElement) {
    if (this.editing) {
      this.quill = quill;
      this.body = body;
      this.renderQuill();
    }
  }

  public getTitle() {
    if (this.quill) {
      return `${this.quill.getText(0, 20)}`;
    }
    return "Text";
  }

  public set(key: string, value: any, isSource = false) {
    const section = deepCopy(this.section.data);
    section.components = section.components.map((component: any) => {
      if (component.id === this.id) {
        component[key] = key === "html" ? value : value.content;
      }
      return component;
    });

    this.section.data = getSection(section);
    this.section.page.cache();

    if (!isSource) {
      if (key === "text" && this.quill) {
        this.quill.updateContents(value.delta);
      } else if (key === "html" && !this.editing) {
        this.renderHTML(value);
      }
    }
  }

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

    if (!this.editing) {
      this.renderHTML();
    } else if (this.quill) {
      this.renderQuill();
    }
  }

  private renderHTML(html = this.get("html")) {
    if (html) {
      const article = document.createElement("article");
      setStyle(article, {
        gridArea: "text",
        ...maybe(this.data, "style", {})
      });

      article.className = "ql-container ql-snow";

      const wrapper = document.createElement("div");

      wrapper.className = "ql-editor";
      wrapper.innerHTML = html;

      article.append(wrapper);

      this.grid.innerHTML = "";
      this.grid.append(article);
    }
  }

  private renderQuill() {
    if (this.body) {
      setStyle(this.body, {
        gridArea: "text",
        ...maybe(this.data, "style", {})
      });
      this.grid.innerHTML = "";
      this.grid.append(this.body);
    }
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
        gridTemplateAreas: "'text .'"
      };
    }
    case "middle": {
      return {
        display: "grid",
        gridTemplateColumns: `auto minmax(${min}px, ${max}px) auto`,
        gridTemplateRows: "auto 1fr",
        gridTemplateAreas: "'. text .'"
      };
    }
    case "right": {
      return {
        display: "grid",
        gridTemplateColumns: `auto minmax(${min}px, ${max}px)`,
        gridTemplateRows: "auto 1fr",
        gridTemplateAreas: "'. text'"
      };
    }
    case "center": {
      return {
        display: "grid",
        gridTemplateColumns: `auto minmax(${min}px, ${max}px) auto`,
        gridTemplateRows: "1fr auto 1fr",
        gridTemplateAreas: "'. . .' '. text .' '. . .'"
      };
    }
  }
}

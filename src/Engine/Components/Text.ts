import * as Quill from "quill";

import { getSection } from "Engine/Section";

import { deepCopy, maybe, setStyle } from "../Utils";
import { Component } from "./Component";

export class Text extends Component {
  public quill: typeof Quill;

  /**
   * Custom handler for quill based updates.
   *
   * @param key
   * @param value
   * @param isSource
   */
  public set(key: string, value: any, isSource = false) {
    const section = deepCopy(this.section.data);
    section.components = section.components.map((component: any) => {
      if (component.id === this.id) {
        component[key] = value;
      }
      return component;
    });

    this.section.data = getSection(section);
    this.section.page.cache();

    if (isSource) {
      this.section.page.conduit.send("component:set", section.id, this.id, key, value);
    } else {
      this.quill.setContents(value);
    }
  }

  /**
   * Render quill.
   */
  public render() {
    const grid = document.createElement("div");
    setStyle(grid, {
      ...getGridLayout(maybe<string>(this.data, "settings.layout"), maybe<number>(this.data, "settings.min"), maybe<number>(this.data, "settings.max")),
      minHeight: this.section.height
    });
    if (maybe<boolean>(this.data, "settings.sticky", false)) {
      setStyle(grid, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%"
      });
    }
    this.section.append(grid);

    const body = document.createElement("article");
    setStyle(body, {
      gridArea: "text",
      ...maybe(this.data, "style", {})
    });
    grid.append(body);

    this.quill = new Quill(body, {
      theme: "bubble",
      placeholder: "Compose an epic...",
      readOnly: false,
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"], // toggled buttons
          ["blockquote", "code-block"],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }], // superscript/subscript
          [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
          [{ direction: "rtl" }], // text direction

          [{ size: ["small", false, "large", "huge"] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],

          ["clean"] // remove formatting button
        ]
      }
    });

    this.quill.on("text-change", (delta: any, oldDelta: any, source: any) => {
      if (source === "user") {
        this.set("text", this.quill.getContents(), true);
      }
    });

    this.quill.setContents(this.data.text);
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
        gridTemplateRows: "1fr",
        gridTemplateAreas: "'text .'"
      };
    }
    case "middle": {
      return {
        display: "grid",
        gridTemplateColumns: `auto minmax(${min}px, ${max}px) auto`,
        gridTemplateRows: "1fr",
        gridTemplateAreas: "'. text .'"
      };
    }
    case "right": {
      return {
        display: "grid",
        gridTemplateColumns: `auto minmax(${min}px, ${max}px)`,
        gridTemplateRows: "1fr",
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

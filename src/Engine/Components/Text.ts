import * as Quill from "quill";

import { getSection } from "Engine/Section";

import { deepCopy, maybe, setStyle } from "../Utils";
import { Component } from "./Component";

export class Text extends Component {
  public quill: typeof Quill;
  public grid: HTMLDivElement;

  public getTitle() {
    return `${this.quill.getText(0, 20)}...`;
  }

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

    const body = document.createElement("article");
    setStyle(body, {
      gridArea: "text",
      ...maybe(this.data, "style", {})
    });
    this.grid.append(body);

    this.quill = new Quill(body, {
      theme: "snow",
      placeholder: "Compose an epic..."
    });

    this.quill.on("selection-change", (range: any) => {
      if (range) {
        this.section.page.emit("edit", this.section, this);
      }
    });

    this.quill.on("text-change", (delta: any, oldDelta: any, source: any) => {
      if (source === "user") {
        const data = { content: this.quill.getContents(), delta };
        this.section.page.conduit.send("component:set", this.section.id, this.id, "text", data);
        this.set("text", data, true);
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

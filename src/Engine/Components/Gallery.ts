import { viewport } from "Engine/Viewport";

import { setStyle } from "../Utils";
import { Component } from "./Component";

export class Gallery extends Component {
  public getTitle() {
    return this.get("title", "Gallery");
  }

  public render() {
    const container = document.createElement("div");
    setStyle(container, {
      height: viewport.height,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gridGap: "1em",
      justifyContent: "center",
      minWidth: "100%",
      minHeight: "100%",

      ...(this.data.style || {})
    });

    const items = this.get("items");

    items.forEach((item: any, index: number) => {
      const itemContainer = document.createElement("div");
      setStyle(itemContainer, {
        margin: "auto"
      });

      const img = document.createElement("img");
      img.width = 300;
      img.height = 169;
      img.src = item.src;
      setStyle(img, {});
      itemContainer.append(img);
      container.append(itemContainer);
    });

    container.onclick = () => {
      this.section.page.emit("edit", this.section, this);
    };
    this.section.append(this.id, container);
  }
}

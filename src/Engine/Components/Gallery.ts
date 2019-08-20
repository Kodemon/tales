import { viewport } from "Engine/Viewport";

import { Component } from "../Component";
import { setStyle } from "../Utils";

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
      this.page.emit("edit", this.stack, this);
    };
    this.stack.append(this.id, container);
  }
}

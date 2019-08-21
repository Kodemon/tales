import { viewport } from "Engine/Viewport";

import { Component } from "../Component";
import { Stack } from "../Stack";
import { setStyle } from "../Utils";

export class Gallery extends Component {
  public element: HTMLDivElement;

  constructor(stack: Stack, data: any) {
    super(stack, data);

    this.area.append((this.element = document.createElement("div")));
    this.element.id = data.id;

    const items = this.getSetting("items");

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
      this.element.append(itemContainer);
    });

    this.element.onclick = () => {
      this.page.emit("edit", this.stack, this);
    };
  }

  public render() {
    setStyle(this.element, {
      height: viewport.height,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gridGap: "1em",
      justifyContent: "center",
      minWidth: "100%",
      minHeight: "100%",
      ...(this.data.style || {})
    });
  }
}

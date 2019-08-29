import { viewport } from "Engine/Viewport";

import { Component } from "../Component";
import { Stack } from "../Stack";
import { setStyle } from "../Utils";

export class Gallery extends Component {
  public element: HTMLElement;

  constructor(stack: Stack, data: any) {
    super(stack, data);

    this.element = document.createElement("amp-carousel");
    this.element.id = data.id;
    this.element.setAttribute("layout", "responsive");
    this.element.setAttribute("type", "slides");
    this.element.setAttribute("autoplay", "");
    this.element.setAttribute("delay", "8000");
    this.element.setAttribute("Width", `${viewport.width}px`);
    this.element.setAttribute("height", `${viewport.height}px`);

    const items = this.getSetting("items");
    items.forEach((item: any, index: number) => {
      // const itemContainer = document.createElement("div");

      // setStyle(itemContainer, {
      //   margin: "auto"
      // });

      const img = document.createElement("amp-img");
      img.setAttribute("layout", "fill");
      // img.width = 300;
      // img.height = 169;
      img.setAttribute("src", item.src);
      setStyle(img, {});
      this.element.append(img);
      //      this.element.append(itemContainer);
    });

    this.element.onclick = () => {
      this.edit();
    };

    setStyle(this.element, { pointerEvents: "auto" });
    this.area.append(this.element);
  }

  public render() {
    super.render();

    // setStyle(this.element, {
    //   height: viewport.height,
    //   display: "grid",
    //   gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    //   gridGap: "1em",
    //   justifyContent: "center",
    //   minWidth: "100%",
    //   minHeight: "100%",
    //   ...(this.data.style || {})
    // });
  }
}

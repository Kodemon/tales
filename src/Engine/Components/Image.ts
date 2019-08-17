import { viewport } from "Engine/Viewport";

import { setStyle } from "../Utils";
import { Component } from "./Component";

export class Image extends Component {
  public getTitle() {
    return this.get("title", "Image");
  }

  public render() {
    const image = document.createElement("img");

    image.src = this.get("src");
    image.title = this.get("title", "");
    image.alt = this.get("altText", "");

    const position = this.getSetting("position");
    switch (position) {
      case "background": {
        image.className = "component-absolute";
        setStyle(image, {
          objectFit: "cover",
          width: "100%",
          height: "100%"
        });
        this.section.append(image);
        break;
      }

      case "sticky": {
        const container = document.createElement("div");
        container.className = "component-fixed_container";

        const scroller = document.createElement("div");
        scroller.className = "component-scroll_overlay";

        image.className = "component-fixed_component";
        setStyle(image, {
          objectFit: "cover",
          objectPosition: "50% 0",
          width: viewport.width,
          height: "100%"
        });

        container.append(image);
        container.append(scroller);

        container.onclick = () => {
          this.section.page.emit("edit", this.section, this);
        };

        this.section.append(container);
        break;
      }

      default: {
        setStyle(image, {
          display: "block",
          width: "100%",
          ...(this.data.style || {})
        });
        image.onclick = () => {
          this.section.page.emit("edit", this.section, this);
        };
        this.section.append(image);
      }
    }
  }
}

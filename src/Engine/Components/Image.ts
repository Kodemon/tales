import { setStyle } from "../Utils";
import { Component } from "./Component";

export class Image extends Component {
  public render() {
    const image = document.createElement("img");

    image.src = this.getSetting("src");

    const position = this.getSetting("position");
    switch (position) {
      case "background": {
        image.className = "component-absolute";
        setStyle(image, {
          objectFit: "cover",
          width: this.section.page.viewport.width,
          height: this.section.height * this.getSetting("height", 0)
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
          width: this.section.page.viewport.width,
          height: "100%"
        });

        container.append(image);
        container.append(scroller);

        this.section.append(container);
        break;
      }

      default: {
        setStyle(image, {
          display: "block",
          ...(this.data.style || {})
        });
        this.section.append(image);
      }
    }
  }
}

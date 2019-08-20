import { viewport } from "Engine/Viewport";

import { Stack } from "Engine/Stack";
import { Component } from "../Component";
import { setStyle } from "../Utils";

export class Image extends Component {
  /**
   * Primary image element.
   * @type {HTMLElement}
   */
  public element: HTMLElement;

  /**
   * Image element.
   * @type {HTMLImageElement}
   */
  private image?: HTMLImageElement;

  /**
   * Scroller element, used during sticky positioning.
   * @type {HTMLDivElement}
   */
  private scroller?: HTMLDivElement;

  constructor(stack: Stack, data: any) {
    super(stack, data);
    this.stack.element.append((this.element = document.createElement("figure")));
  }

  public render() {
    const image = this.image || document.createElement("img");

    image.src = this.getSetting("src");
    image.title = this.getSetting("title", "");
    image.alt = this.getSetting("altText", "");
    image.onclick = () => {
      this.page.emit("edit", this.section, this.stack, this);
    };

    if (!this.image) {
      this.image = image;
      this.element.append(image);
    }

    if (this.scroller) {
      this.scroller.remove();
      this.scroller = undefined;
    }

    const position = this.getSetting("position");
    switch (position) {
      case "background": {
        this.element.className = "component-absolute";
        this.image.className = "";
        setStyle(
          image,
          {
            objectFit: "cover",
            width: viewport.width,
            height: "100%"
          },
          true
        );
        break;
      }

      case "sticky": {
        this.element.className = "component-fixed_container";

        const scroller = document.createElement("div");
        scroller.className = "component-scroll_overlay";
        scroller.onclick = () => {
          this.page.emit("edit", this.section, this.stack, this);
        };

        image.className = "component-fixed_component";
        setStyle(
          image,
          {
            objectFit: "cover",
            objectPosition: "50% 0",
            width: viewport.width,
            height: "100%"
          },
          true
        );

        if (!this.scroller) {
          this.scroller = scroller;
          this.element.append(scroller);
        }

        break;
      }

      default: {
        this.element.className = "";
        this.image.className = "";
        setStyle(
          image,
          {
            display: "block",
            width: viewport.width,
            ...(this.data.style || {})
          },
          true
        );
      }
    }
  }
}

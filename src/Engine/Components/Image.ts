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
  private image: HTMLImageElement;

  /**
   * Scroller element, used during sticky positioning.
   * @type {HTMLDivElement}
   */
  private scroller?: HTMLDivElement;

  constructor(stack: Stack, data: any) {
    super(stack, data);

    this.area.append((this.element = document.createElement("figure")));
    this.element.id = data.id;

    this.image = document.createElement("img");
    this.image.onclick = () => {
      this.page.emit("edit", this.section, this.stack, this);
    };
    this.element.append(this.image);
  }

  public render() {
    super.render();

    this.image.src = this.getSetting("src");
    this.image.title = this.getSetting("title", "");
    this.image.alt = this.getSetting("altText", "");

    if (this.scroller) {
      this.scroller.remove();
      this.scroller = undefined;
    }

    const position = this.getSetting("position");
    switch (position) {
      case "absolute": {
        this.element.className = "position-fixed";
        this.image.className = "";
        setStyle(
          this.image,
          {
            objectFit: "cover",
            width: "100%",
            height: "100%"
          },
          true
        );
        break;
      }

      case "sticky": {
        this.element.className = "position-fixed";
        this.image.className = "position-sticky";
        setStyle(
          this.image,
          {
            objectFit: "cover",
            objectPosition: "50% 0",
            width: "100%",
            height: "100%"
          },
          true
        );
        break;
      }

      case "fixed": {
        this.element.className = "position-fixed_container";

        const scroller = document.createElement("div");
        scroller.className = "position-scroll_overlay";
        scroller.onclick = () => {
          this.page.emit("edit", this.section, this.stack, this);
        };

        this.image.className = "position-fixed_component";
        setStyle(
          this.image,
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
          this.image,
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

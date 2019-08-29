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
  private image: any;

  /**
   * Scroller element, used during sticky positioning.
   * @type {HTMLDivElement}
   */
  private scroller?: HTMLDivElement;

  constructor(stack: Stack, data: any) {
    super(stack, data);

    this.area.append((this.element = document.createElement("figure")));
    this.element.id = data.id;

    this.element.onclick = () => {
      this.edit();
    };

    setStyle(this.element, { pointerEvents: "auto" });
  }

  public render() {
    super.render();
    if (this.element.children.length === 0) {
      this.image = document.createElement("amp-img");
      this.image.setAttribute(
        "src",
        this.getSetting("src", "https://images.unsplash.com/photo-1505207820475-ad20164d3936?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80")
      );
      this.image.title = this.getSetting("title", "");
      this.image.alt = this.getSetting("altText", "");
      this.image.setAttribute("layout", "fill");
      this.image.className = "cover";
      this.element.append(this.image);
    }
    if (this.scroller) {
      this.scroller.remove();
      this.scroller = undefined;
    }

    // ### Reset Element Style

    setStyle(this.element, {
      top: null
    });

    // ### Apply ELement Style

    let objectPosition: string = this.getSetting("objetPosition", "center center");
    const focal = this.getSetting("focal");
    if (focal) {
      objectPosition = `${focal.x * 100}% ${focal.y * 100}%`;
    }

    const position = this.getSetting("position");
    switch (position) {
      case "absolute": {
        this.element.className = "position-fixed";
        // this.image.className = "";
        // setStyle(
        //   this.image,
        //   {
        //     objectFit: "cover",
        //     objectPosition,
        //     width: "100%",
        //     height: "100%",
        //     top: null
        //   },
        //   true
        // );
        break;
      }

      case "sticky": {
        this.element.className = "position-fixed";
        // this.image.className = "position-sticky";
        // setStyle(
        //   this.image,
        //   {
        //     objectFit: "cover",
        //     objectPosition,
        //     width: "100%",
        //     height: "100%",
        //     top: null
        //   },
        //   true
        // );
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
        // setStyle(
        //   this.image,
        //   {
        //     objectFit: "cover",
        //     objectPosition,
        //     top: viewport.offset.top,
        //     width: viewport.width,
        //     height: viewport.height
        //   },
        //   true
        // );

        if (!this.scroller) {
          this.scroller = scroller;
          this.element.append(scroller);
        }

        break;
      }

      default: {
        this.element.className = "";
        // this.image.className = "";
        // setStyle(
        //   this.image,
        //   {
        //     display: "block",
        //     width: viewport.width,
        //     ...(this.data.style || {}),
        //     top: null
        //   },
        //   true
        // );
      }
    }
  }
}

import { viewport } from "Engine/Viewport";

import { Stack } from "Engine/Stack";
import { Component } from "../Component";
import { setStyle } from "../Utils";

export class Vimeo extends Component {
  /**
   * Primary vimeo element.
   * @type {HTMLElement}
   */
  public element: HTMLElement;

  /**
   * Vimeo element.
   * @type {HTMLVimeoElement}
   */
  private frame: HTMLIFrameElement;

  /**
   * Scroller element, used during sticky positioning.
   * @type {HTMLDivElement}
   */
  private scroller?: HTMLDivElement;

  constructor(stack: Stack, data: any) {
    super(stack, data);

    this.area.append((this.element = document.createElement("div")));
    this.element.id = data.id;

    setStyle(this.element, {
      pointerEvents: "auto",
      position: "relative",
      paddingBottom: "56.25%" /* 16:9 */,
      height: 0
    });

    this.frame = document.createElement("iframe");
    this.frame.setAttribute("frameborder", "0");
    this.frame.setAttribute("allow", "accelerometer; autoplay; fullscreen; encrypted-media; gyroscope; picture-in-picture");
    this.frame.setAttribute("allowfullscreen", "true");
    this.frame.onclick = () => {
      this.edit();
    };
    this.element.append(this.frame);
  }

  public render() {
    super.render();
    const id = this.getSetting("id", "352206373");
    this.frame.src = `https://player.vimeo.com/video/${id}`;

    if (this.scroller) {
      this.scroller.remove();
      this.scroller = undefined;
    }

    // ### Reset Element Style

    setStyle(this.element, {
      top: null
    });

    // ### Apply ELement Style

    const position = this.getSetting("position");
    switch (position) {
      case "absolute": {
        this.element.className = "position-fixed";
        this.frame.className = "";
        setStyle(
          this.frame,
          {
            objectFit: "cover",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none"
          },
          true
        );
        break;
      }

      case "sticky": {
        this.element.className = "position-fixed";
        this.frame.className = "position-sticky";
        setStyle(
          this.frame,
          {
            objectFit: "cover",
            objectPosition: "50% 0",
            width: "100%",
            height: "100%",
            top: null
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

        this.frame.className = "position-fixed_component";
        setStyle(
          this.frame,
          {
            objectFit: "cover",
            objectPosition: "50% 0",
            top: viewport.offset.top,
            width: viewport.width,
            height: viewport.height
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
        this.frame.className = "";
        setStyle(
          this.frame,
          {
            display: "block",
            width: viewport.width,
            ...(this.data.style || {}),
            top: null
          },
          true
        );
      }
    }
  }
}

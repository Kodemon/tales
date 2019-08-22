import { viewport } from "Engine/Viewport";

import { Stack } from "Engine/Stack";
import { Component } from "../Component";
import { setStyle } from "../Utils";

export class YouTube extends Component {
  /**
   * Primary youTube element.
   * @type {HTMLElement}
   */
  public element: HTMLElement;

  /**
   * YouTube element.
   * @type {HTMLYouTubeElement}
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

    this.frame = document.createElement("iframe");
    this.frame.setAttribute("frameborder", "0");
    this.frame.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
    this.frame.setAttribute("allowfullscreen", "true");
    this.frame.onclick = () => {
      this.page.emit("edit", this.section, this.stack, this);
    };
    this.element.append(this.frame);
  }

  public render() {
    super.render();

    this.frame.src = "https://www.youtube.com/embed/05ZHUuQVvJM?controls=0";

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
            top: null
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

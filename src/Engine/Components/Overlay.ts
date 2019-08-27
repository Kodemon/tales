import { viewport } from "Engine/Viewport";

import { Component } from "../Component";
import { Stack } from "../Stack";
import { setStyle } from "../Utils";

export class Overlay extends Component {
  public element: HTMLDivElement;

  constructor(stack: Stack, data: any) {
    super(stack, data);
    this.area.append((this.element = document.createElement("div")));
    this.element.id = data.id;
    this.element.onclick = () => {
      this.edit();
    };
    setStyle(this.element, { pointerEvents: "none" });
  }

  public render() {
    super.render();

    const background = this.getSetting("background");
    const borderWidth = this.getStyle("borderWidth");

    this.element.className = this.getSetting("sticky", false) ? "position-sticky" : "position-fixed";

    const style = {
      width: "100%",
      height: this.getStyle("height", "100%"),
      ...(borderWidth ? { border: `${borderWidth}px solid white` } : {}),
      ...(this.data.style || {})
    };

    const type = this.getSetting("type");
    switch (type) {
      case "topToBottom": {
        style.boxShadow = `none`;
        style.background = `linear-gradient(0deg, ${background} 0%, transparent 100%)`;
        break;
      }
      case "bottomToTop": {
        style.boxShadow = `none`;
        style.background = `linear-gradient(180deg, ${background} 0%, transparent 100%)`;
        break;
      }
      case "rightToLeft": {
        style.boxShadow = `none`;
        style.background = `linear-gradient(90deg, ${background} 0%, transparent 100%)`;
        break;
      }
      case "leftToRight": {
        style.boxShadow = `none`;
        style.background = `linear-gradient(270deg, ${background} 0%, transparent 100%)`;
        break;
      }
      case "vignette": {
        style.background = `none`;
        style.boxShadow = `inset 0 0 25vmin 10vmin ${background}`;
        break;
      }
      case "solid":
      default: {
        style.background = `${background}`;
      }
    }

    setStyle(this.element, style);
  }
}

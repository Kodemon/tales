import { viewport } from "Engine/Viewport";

import { setStyle } from "../Utils";
import { Component } from "./Component";

export class Overlay extends Component {
  public getTitle() {
    return this.get("title", "Overlay");
  }

  public render() {
    const el = document.createElement("div");

    const position = this.getSetting("position");
    const type = this.getSetting("type");
    const background = this.getSetting("background");
    switch (position) {
      case "background": {
        el.className = "component-absolute";
        setStyle(el, {
          objectFit: "cover",
          width: "100%",
          height: "100%"
        });
        break;
      }
      default: {
        setStyle(el, {
          display: "block",
          width: "100%",
          ...(this.data.style || {})
        });
      }
    }
    switch (type) {
      case "topToBottom": {
        setStyle(el, {
          backgroundImage: `linear-gradient(0deg, ${background} 0%, transparent 100%)`
        });
        break;
      }
      case "bottomToTop": {
        setStyle(el, {
          backgroundImage: `linear-gradient(180deg, ${background} 0%, transparent 100%)`
        });
        break;
      }
      case "rightToLeft": {
        setStyle(el, {
          backgroundImage: `linear-gradient(90deg, ${background} 0%, transparent 100%)`
        });
        break;
      }
      case "leftToRight": {
        setStyle(el, {
          backgroundImage: `linear-gradient(270deg, ${background} 0%, transparent 100%)`
        });
        break;
      }
      case "vignette": {
        setStyle(el, {
          boxShadow: `inset 0 0 25vmin 10vmin ${background}`
        });
        break;
      }
      default: {
        setStyle(el, {
          background: `${background}`
        });
      }
    }
    el.onclick = () => {
      this.section.page.emit("edit", this.section, this);
    };
    this.section.append(this.id, el);
  }
}

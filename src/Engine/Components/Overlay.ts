import { viewport } from "Engine/Viewport";

import { setStyle } from "../Utils";
import { Component } from "./Component";

export class Overlay extends Component {
  public getTitle() {
    return this.get("title", "Overlay");
  }

  public render() {
    const el = document.createElement("div");
    const type = this.getSetting("type");
    const background = this.getSetting("background");
    const borderWidth = this.getSetting("borderWidth");
    el.className = "component-absolute";
    const styles = {
      width: viewport.width,
      height: this.getStyle("height", viewport.height),
      ...(borderWidth ? { border: `${borderWidth}px solid white` } : {}),
      ...(this.data.style || {})
    };
    switch (type) {
      case "topToBottom": {
        setStyle(el, {
          backgroundImage: `linear-gradient(0deg, ${background} 0%, transparent 100%)`,
          ...styles
        });
        break;
      }
      case "bottomToTop": {
        setStyle(el, {
          backgroundImage: `linear-gradient(180deg, ${background} 0%, transparent 100%)`,
          ...styles
        });
        break;
      }
      case "rightToLeft": {
        setStyle(el, {
          backgroundImage: `linear-gradient(90deg, ${background} 0%, transparent 100%)`,
          ...styles
        });
        break;
      }
      case "leftToRight": {
        setStyle(el, {
          backgroundImage: `linear-gradient(270deg, ${background} 0%, transparent 100%)`,
          ...styles
        });
        break;
      }
      case "vignette": {
        setStyle(el, {
          boxShadow: `inset 0 0 25vmin 10vmin ${background}`,
          ...styles
        });
        break;
      }
      default: {
        setStyle(el, {
          background: `${background}`,
          ...styles
        });
      }
    }
    el.onclick = () => {
      this.section.page.emit("edit", this.section, this);
    };
    this.section.append(this.id, el);
  }
}

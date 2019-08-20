import { viewport } from "Engine/Viewport";

import { Component } from "../Component";
import { setStyle } from "../Utils";

export class Overlay extends Component {
  public getTitle() {
    return this.get("title", "Overlay");
  }

  public render() {
    const el = document.createElement("div");
    const type = this.getSetting("type");
    const background = this.getSetting("background");
    const borderWidth = this.getSetting("borderWidth");
    el.className = this.getSetting("sticky", false) ? "section-sticky" : "component-absolute";
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
      this.page.emit("edit", this.stack, this);
    };
    this.stack.append(this.id, el);
  }
}

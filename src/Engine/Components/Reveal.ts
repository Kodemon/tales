import * as enterView from "enter-view";
import { EventEmitter } from "eventemitter3";

import { viewport } from "Engine/Viewport";

import { setStyle, translate } from "../Utils";
import { Component } from "./Component";

const events = new EventEmitter();

export class Reveal extends Component {
  public getTitle() {
    return this.get("title", "Reveal");
  }

  public render() {
    const container = document.createElement("div");
    setStyle(container, {
      position: "sticky",
      top: 0,
      height: viewport.height
    });

    const app = new PIXI.Application();

    container.appendChild(app.view);

    const items = this.get("items");
    items.forEach((item: any, index: number) => {
      app.loader.add(`reveal-${this.id}-${index}`, item.src).load((loader, resources) => {
        console.log("loaded", item);
      });
    });
  }

  /*
  public render() {
    const container = document.createElement("div");
    setStyle(container, {
      position: "sticky",
      top: 0,
      height: viewport.height
    });

    const items = this.get("items");
    const offset = 1 / items.length;

    items.forEach((item: any, index: number) => {
      const image = document.createElement("img");

      image.src = item.src;

      setStyle(image, {
        position: "fixed",
        top: 0,
        objectFit: "cover",
        width: viewport.width,
        height: viewport.height
      });

      const wrapper = document.createElement("div");
      setStyle(wrapper, {
        position: "absolute",
        width: "100%",
        height: viewport.height
      });

      const mask = document.createElement("div");
      mask.append(image);
      wrapper.append(mask);

      setStyle(mask, {
        position: "absolute",
        width: "100%",
        height: viewport.height,
        clip: "rect(0, auto, auto, 0)"
      });

      if (index > 0) {
        switch (item.transition) {
          case "fade": {
            setStyle(image, {
              opacity: 0
            });
            break;
          }
          case "up": {
            setStyle(mask, {
              position: "absolute",
              bottom: 0,
              left: 0,
              height: 0
            });
            break;
          }
          case "down": {
            setStyle(mask, {
              height: 0
            });
            break;
          }
          case "left": {
            setStyle(mask, {
              width: 0
            });
            break;
          }
          case "right": {
            setStyle(image, {
              left: 0,
              width: "100%"
            });
            setStyle(mask, {
              position: "absolute",
              right: 0,
              width: 0
            });
            break;
          }
        }

        const start = offset * index;
        const end = start + offset;

        events.on("progress", (id: string, progress: number) => {
          if (id === this.id) {
            const style: any = {};
            const percent = (progress - start) / offset; // the percentage of the index 0 - 1
            const fullPercent = Math.floor(percent * 100);

            switch (item.transition) {
              case "swap": {
                style.opacity = start < progress && progress < end ? 1 : progress < start ? 0 : 1;
                break;
              }
              case "fade": {
                style.opacity = percent > 1 ? 1 : percent < 0 ? 0 : percent;
                setStyle(image, style);
                break;
              }
              case "up": {
                style.height = `${fullPercent < 0 ? 0 : fullPercent > 100 ? 100 : fullPercent}%`;
                setStyle(mask, style);
                break;
              }
              case "down": {
                style.height = `${fullPercent < 0 ? 0 : fullPercent > 100 ? 100 : fullPercent}%`;
                setStyle(mask, style);
                break;
              }
              case "left": {
                style.width = `${fullPercent < 0 ? 0 : fullPercent > 100 ? 100 : fullPercent}%`;
                setStyle(mask, style);
                break;
              }
              case "right": {
                style.width = `${fullPercent < 0 ? 0 : fullPercent > 100 ? 100 : fullPercent}%`;
                setStyle(mask, style);
                break;
              }
            }
          }
        });
      }

      container.append(wrapper);
    });

    container.onclick = () => {
      this.section.page.emit("edit", this.section, this);
    };

    const scroller = document.createElement("div");
    scroller.className = "component-scroll_overlay";

    container.append(scroller);

    this.section.append(this.id, container);

    this.page.on("loaded", () => {
      enterView({
        selector: [this.section.container],
        offset: 0,
        progress: (el: any, progress: any) => {
          events.emit("progress", this.id, progress);
        }
      });
    });
  }
  */
}

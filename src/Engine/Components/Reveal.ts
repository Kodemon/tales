import * as enterView from "enter-view";
import { EventEmitter } from "eventemitter3";

import { viewport } from "Engine/Viewport";

import { Component } from "../Component";
import { setPixiBackground, setStyle } from "../Utils";

const events = new EventEmitter();

export class Reveal extends Component {
  public getTitle() {
    return this.get("title", "Reveal");
  }

  public render() {
    const wrapper = document.createElement("div");
    wrapper.className = "component-absolute";

    const container = document.createElement("div");
    setStyle(container, {
      height: viewport.height
    });
    container.className = "section-sticky";

    const app = new PIXI.Application({
      width: viewport.width,
      height: viewport.height
    });

    container.appendChild(app.view);

    const items = this.get("items");
    const offset = items ? 1 / items.length : 1;

    items.forEach((item: any, index: number) => {
      const sprite = app.stage.addChild(PIXI.Sprite.from(item.src));

      setPixiBackground(
        {
          x: viewport.width,
          y: viewport.height
        },
        sprite,
        "cover"
      );

      let mask: PIXI.Graphics | undefined;
      if (index !== 0) {
        switch (item.transition) {
          case "up":
          case "right":
          case "down":
          case "left": {
            mask = new PIXI.Graphics();
            sprite.mask = mask;
            break;
          }
        }
      }

      const start = offset * index;
      const end = start + offset;

      events.on("progress", (id: string, progress: number) => {
        if (id === this.id) {
          const decimal = (progress - start) / offset; // the percentage of the index 0 - 1
          switch (item.transition) {
            case "swap": {
              sprite.alpha = start < progress && progress < end ? 1 : progress < start ? 0 : 1;
              break;
            }
            case "fade": {
              sprite.alpha = decimal > 1 ? 1 : decimal < 0 ? 0 : decimal;
              break;
            }
            case "up": {
              if (mask) {
                mask.clear();
                mask.beginFill(0xff3300).drawRect(0, viewport.height - viewport.height * decimal, viewport.width, viewport.height * decimal);
              }
              break;
            }
            case "right": {
              if (mask) {
                mask.clear();
                mask.beginFill(0xff3300).drawRect(viewport.width - viewport.width * decimal, 0, viewport.width * decimal, viewport.height);
              }
              break;
            }
            case "down": {
              if (mask) {
                mask.clear();
                mask.beginFill(0xff3300).drawRect(0, 0, viewport.width, viewport.height * decimal);
              }
              break;
            }
            case "left": {
              if (mask) {
                mask.clear();
                mask.beginFill(0xff3300).drawRect(0, 0, viewport.width * decimal, viewport.height);
              }
              break;
            }
          }
        }
      });
    });

    wrapper.onclick = () => {
      this.page.emit("edit", this.stack, this);
    };

    const scroller = document.createElement("div");
    scroller.className = "component-scroll_overlay";

    wrapper.append(container);
    wrapper.append(scroller);

    this.stack.append(this.id, wrapper);

    this.page.on("loaded", () => {
      enterView({
        selector: [this.stack.element],
        offset: 0,
        progress: (el: any, progress: any) => {
          events.emit("progress", this.id, progress);
        }
      });
    });
  }
}

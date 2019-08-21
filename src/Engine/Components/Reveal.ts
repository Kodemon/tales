import * as enterView from "enter-view";
import { EventEmitter } from "eventemitter3";

import { Component } from "../Component";
import { Stack } from "../Stack";
import { setPixiBackground, setStyle } from "../Utils";
import { viewport } from "../Viewport";

const events = new EventEmitter();

export class Reveal extends Component {
  public element: HTMLDivElement;

  public container: HTMLDivElement;

  public app: any;

  public scroller: HTMLDivElement;

  public offset: number;

  constructor(stack: Stack, data: any) {
    super(stack, data);

    this.area.append((this.element = document.createElement("div")));
    this.element.id = data.id;
    this.element.className = "component-absolute";

    this.container = document.createElement("div");
    this.container.className = "section-sticky";
    this.element.append(this.container);

    this.app = new PIXI.Application();
    this.container.append(this.app.view);

    this.loadItems();

    this.scroller = document.createElement("div");
    this.scroller.className = "component-scroll_overlay";
    this.container.append(this.scroller);

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

  private loadItems() {
    const items = this.getSetting("items");
    const offset = (this.offset = items ? 1 / items.length : 1);

    items.forEach((item: any, index: number) => {
      const sprite = this.app.stage.addChild(PIXI.Sprite.from(item.src));

      setPixiBackground(
        {
          x: viewport.width,
          y: viewport.height
        },
        sprite,
        "cover"
      );

      let mask: any;
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
  }

  public render() {
    setStyle(this.container, { height: viewport.height });

    this.app.view.width = viewport.width;
    this.app.view.height = viewport.height;
  }
}

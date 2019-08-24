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

  public sprites: any[] = [];

  constructor(stack: Stack, data: any) {
    super(stack, data);

    this.area.append((this.element = document.createElement("div")));
    this.element.id = data.id;
    this.element.className = "position-fixed";

    this.container = document.createElement("div");
    this.container.className = "position-sticky";
    this.element.append(this.container);

    this.app = new PIXI.Application();
    this.container.append(this.app.view);

    this.loadItems();

    this.scroller = document.createElement("div");
    this.scroller.className = "position-scroll_overlay";
    this.container.append(this.scroller);

    enterView({
      selector: [this.stack.element],
      offset: 0,
      progress: (el: any, progress: any) => {
        events.emit("progress", this.id, progress);
      }
    });
  }

  private async loadItems() {
    const items = this.getSetting("items");
    const offset = (this.offset = items ? 1 / items.length : 1);

    let index = 0;
    for (const item of items) {
      const sprite = this.app.stage.addChild(PIXI.Sprite.from(await getImage(item.src)));

      this.sprites.push(sprite);

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
          case "fade": {
            sprite.alpha = 0;
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

      index += 1;
    }

    this.render();
  }

  public render() {
    super.render();

    setStyle(this.container, { height: viewport.height });

    this.app.view.width = viewport.width;
    this.app.view.height = viewport.height;
  }
}

/**
 * Get image from url src.
 *
 * @param src
 *
 * @returns loaded image
 */
async function getImage(src: string) {
  return new Promise(resolve => {
    toDataURL(src, (data: any) => {
      const image = new Image();
      image.onload = function() {
        resolve(image);
      };
      image.src = data;
    });
  });
}

/**
 * Convert a url to a base64 string.
 *
 * @param url
 * @param callback
 *
 * @returns base64 image
 */
function toDataURL(url: any, callback: any) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    const reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.send();
}

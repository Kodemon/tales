import "TweenMax";

import * as ScrollMagic from "scrollmagic";

import "animation.gsap";
import "debug.addIndicators";

import { getSection, Section } from "./Section";
import { Viewport } from "./Viewport";

export class Page {
  /**
   * Editing state.
   * @type {boolean}
   */
  public editing: boolean;

  /**
   * Container.
   * @type {HTMLDivElement}
   */
  public container: HTMLDivElement;

  /**
   * ScrollMagic Controller.
   * @type {ScrollMagic.Controller}
   */
  public controller: any;

  /**
   * Viewport dimensions.
   * @type {Viewport}
   */
  public viewport: Viewport;

  /**
   * Event listeners.
   * @type {Map}
   */
  public events: Map<Event, Set<EventHandler>> = new Map();

  /**
   * Scenes.
   * @type {Section[]}
   */
  public sections: Section[] = [];

  /**
   * @param target
   * @param editing
   */
  constructor(container: any) {
    this.container = container;
    this.controller = new ScrollMagic.Controller({
      container: this.container,
      refreshInterval: 0
    });
    const loader = setInterval(() => {
      if (this.container.offsetHeight > 0) {
        clearInterval(loader);
        this.viewport = new Viewport(this.container.offsetWidth, this.container.offsetHeight);
        this.emit("ready");
      }
    }, 100);
  }

  /**
   * Loads a cached page.
   *
   * @param list
   */
  public load(list: any[]) {
    this.container.innerHTML = "";
    for (const data of list) {
      this.sections.push(new Section(this, getSection(data)).render());
    }
    this.emit("loaded");
  }

  /**
   * Add a new scene to the editor.
   *
   * @param props
   */
  public addSection(props?: any) {
    const section = new Section(this, getSection(props));

    this.sections.push(section);

    section.render();

    this.emit("section", section);
    this.cache();

    return section;
  }

  public removeSection(section: Section) {
    this.sections = this.sections.reduce((list: Section[], cached: Section) => {
      if (section !== cached) {
        list.push(cached);
      } else {
        section.container.remove();
      }
      return list;
    }, []);

    this.cache();

    for (const section of this.sections) {
      section.render();
    }

    this.emit("loaded");
  }

  /**
   * Stores the current state of the page.
   */
  public cache() {
    const scenes: any = [];
    this.sections.forEach(scene => {
      scenes.push(scene.data);
    });
    localStorage.setItem("page", JSON.stringify(scenes));
  }

  /**
   * Completely flush the page of all content.
   */
  public flush() {
    localStorage.removeItem("page");
    this.sections = [];
    this.container.innerHTML = "";
  }

  // ### Event Handlers

  /**
   * Add editor event listener.
   *
   * @param event
   * @param fn
   */
  public on(event: Event, fn: EventHandler) {
    let fns = this.events.get(event);
    if (!fns) {
      fns = new Set();
    }
    fns.add(fn);
    this.events.set(event, fns);
    return this;
  }

  /**
   * Remove editor event listener.
   *
   * @param event
   * @param fn
   */
  public off(event: Event, fn: EventHandler) {
    const fns = this.events.get(event);
    if (fns) {
      fns.delete(fn);
      this.events.set(event, fns);
    }
    return this;
  }

  /**
   * Emit editor event.
   *
   * @param event
   */
  public emit(event: Event, ...args: any) {
    const fns = this.events.get(event);
    if (fns) {
      fns.forEach(fn => {
        fn(...args);
      });
    }
  }
}

type EventHandler = (...args: any) => void;
type Event = "ready" | "loaded" | "section" | "edit";

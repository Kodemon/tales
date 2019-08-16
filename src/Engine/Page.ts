import "TweenMax";

import * as ScrollMagic from "scrollmagic";

import "animation.gsap";
import "debug.addIndicators";

import { Conduit, ConduitType } from "./Conduit";
import { getSection, Section } from "./Section";
import { setStyle } from "./Utils";
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
   * Peer
   * @type {Conduit}
   */
  public conduit: Conduit;

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

    // ### Load Conduit

    this.conduit = new Conduit(this);

    // ### Load ScrollMagic Controller

    this.controller = new ScrollMagic.Controller({
      container: this.container,
      refreshInterval: 0
    });

    // ### Load Page

    const loader = setInterval(() => {
      if (this.container.offsetHeight > 0 && this.conduit.id) {
        clearInterval(loader);
        this.viewport = new Viewport(this.container.offsetWidth, this.container.offsetHeight);
        this.emit("ready");
      }
    }, 100);
  }

  /*
  |--------------------------------------------------------------------------------
  | Load Utilities
  |--------------------------------------------------------------------------------
  */

  /**
   * Loads a cached page.
   *
   * @param list
   */
  public load(list: any[]) {
    this.container.innerHTML = "";
    this.sections = [];
    for (const data of list) {
      this.sections.push(new Section(this, getSection(data)).render());
    }
    this.emit("loaded");
  }

  /*
  |--------------------------------------------------------------------------------
  | Conduit Utilities
  |--------------------------------------------------------------------------------
  */

  public connect(peer: string) {
    this.conduit.connect(peer);
  }

  /*
  |--------------------------------------------------------------------------------
  | Section Utilities
  |--------------------------------------------------------------------------------
  */

  /**
   * Add a new scene to the editor.
   *
   * @param data
   * @param isSource
   */
  public addSection(data: any, isSource: boolean = false) {
    const section = new Section(this, getSection(data));

    this.sections.push(section);

    section.render();

    this.emit("section", section);
    this.cache();

    if (isSource) {
      this.conduit.send("section:added", section.data);
    }

    return section;
  }

  /**
   * Update a section.
   *
   * @param data
   */
  public updateSection(data: any) {
    const section = this.sections.find(s => s.id === data.id);
    if (section) {
      section.commit(data);
    }
  }

  /**
   * Removes a section.
   *
   * @param section
   */
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

  /*
  |--------------------------------------------------------------------------------
  | Component Utilities
  |--------------------------------------------------------------------------------
  */

  // ...

  /*
  |--------------------------------------------------------------------------------
  | Storage Utilities
  |--------------------------------------------------------------------------------
  */

  /**
   * Stores the current state of the page.
   */
  public cache() {
    const sections: any = [];
    this.sections.forEach(scene => {
      sections.push(scene.data);
    });
    localStorage.setItem("page", JSON.stringify(sections));
  }

  /**
   * Completely flush the page of all content.
   */
  public flush() {
    localStorage.removeItem("page");
    this.sections = [];
    this.container.innerHTML = "";
  }

  /*
  |--------------------------------------------------------------------------------
  | Event Handlers
  |--------------------------------------------------------------------------------
  */

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

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Event = "ready" | "loaded" | "section" | "edit";

type EventHandler = (...args: any) => void;

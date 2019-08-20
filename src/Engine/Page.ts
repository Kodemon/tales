import { EventEmitter } from "eventemitter3";
import * as rndm from "rndm";

import { Conduit } from "./Conduit";
import { Source } from "./Enums";
import { Section } from "./Section";
import { moveArrayIndex, swapElements } from "./Utils";
import { viewport } from "./Viewport";

export class Page extends EventEmitter {
  /**
   * Unique page id.
   * @type {string}
   */
  public id: string;

  /**
   * Container.
   * @type {HTMLDivElement}
   */
  public element: HTMLDivElement;

  /**
   * Peer
   * @type {Conduit}
   */
  public conduit?: Conduit;

  /**
   * Scenes.
   * @type {Section[]}
   */
  public sections: Section[] = [];

  /**
   * Editing state.
   * @type {boolean}
   */
  public editing: boolean;

  /**
   * Quill, injected from the editor when in edit mode.
   * @type {Quill}
   */
  public Quill: any;

  /**
   * @param element
   * @param data
   */
  constructor(element: any, data: any) {
    super();

    this.element = element;

    this.id = data.id;
    this.editing = data.editing;
    this.Quill = data.Quill;

    // ### Resize Event Handler

    let resizeDebounce: any;
    window.addEventListener("resize", () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(() => {
        this.refresh();
      }, 250);
    });

    // ### Load Page

    const loader = setInterval(() => {
      if (this.element.offsetHeight > 0) {
        clearInterval(loader);
        viewport.setContainer(this.element);
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
   * Load a cached page.
   *
   * @param page
   */
  public load(page: any) {
    this.element.innerHTML = "";
    this.sections = [];
    for (const data of page.sections) {
      const section = new Section(this, data);
      this.sections.push(section);
      section.render();
    }
    this.emit("loaded");
  }

  /**
   * Re-render all the components.
   */
  public refresh() {
    viewport.setContainer(this.element);
    for (const section of this.sections) {
      section.render();
    }
  }

  /*
  |--------------------------------------------------------------------------------
  | Conduit Utilities
  |--------------------------------------------------------------------------------
  */

  /**
   * Initiates a conduit connection using peer.js
   */
  public share() {
    if (!this.conduit) {
      this.conduit = new Conduit(this);
    }
  }

  /**
   * Initiates a peer to peer connection with the given peerId.
   *
   * @param peerId
   */
  public connect(peerId: string) {
    if (this.conduit) {
      this.conduit.connect(peerId);
    } else {
      this.share();
      this.once("conduit:open", () => {
        this.conduit!.connect(peerId);
      });
    }
  }

  /**
   * Sends a new event to all connected connections.
   *
   * @param type
   * @param args
   */
  public send(type: string, ...args: any) {
    if (this.conduit) {
      this.conduit.list.forEach(conn => {
        conn.send(JSON.stringify({ type, args }));
      });
    }
  }

  /*
  |--------------------------------------------------------------------------------
  | Section Utilities
  |--------------------------------------------------------------------------------
  */

  /**
   * Add a new section to the page.
   *
   * @param data
   * @param source
   */
  public addSection(data: any, source: Source = Source.Silent) {
    const section = new Section(this, {
      id: data.id || rndm.base62(10),
      settings: data.settings || {},
      stacks: data.stacks || []
    });

    this.sections.push(section);

    section.render();

    this.cache();

    if (source === Source.User) {
      this.send("section:added", this.id, section.data);
    }

    return section;
  }

  public moveSection(prevIndex: number, nextIndex: number) {
    if (prevIndex === nextIndex) {
      return; // no need to update, indexes are the same
    }

    const sectionA = this.sections[prevIndex];
    const sectionB = this.sections[nextIndex];

    this.sections = moveArrayIndex(this.sections, prevIndex, nextIndex);

    swapElements(sectionA.element, sectionB.element);

    this.cache();
    this.emit("refresh");
  }

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
    this.sections.forEach(section => {
      sections.push(section.toJSON());
    });
    localStorage.setItem(
      `page.${this.id}`,
      JSON.stringify({
        id: this.id,
        title: "Unknown",
        sections
      })
    );
  }

  /**
   * Completely flush the page of all content.
   */
  public flush() {
    localStorage.removeItem(`page.${this.id}`);
    this.sections = [];
    this.element.innerHTML = "";
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Event = "ready" | "loaded" | "section" | "edit";

type EventHandler = (...args: any) => void;

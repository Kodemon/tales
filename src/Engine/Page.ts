import { EventEmitter } from "eventemitter3";

import { Conduit } from "./Conduit";
import { getSection, Section } from "./Section";
import { viewport } from "./Viewport";

export class Page extends EventEmitter {
  /**
   * Unique page id.
   * @type {string}
   */
  public id: string;

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
  public conduit?: Conduit;

  /**
   * Scenes.
   * @type {Section[]}
   */
  public sections: Section[] = [];

  /**
   * @param id
   * @param target
   * @param editing
   */
  constructor(id: string, container: any, editing = false) {
    super();

    this.id = id;
    this.container = container;
    this.editing = editing;

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
      if (this.container.offsetHeight > 0) {
        clearInterval(loader);
        viewport.setContainer(this.container);
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
    this.container.innerHTML = "";

    this.sections = [];
    for (const data of page.sections) {
      this.sections.push(new Section(this, getSection(data)).render());
    }

    this.emit("loaded");
  }

  /**
   * Re-render all the components.
   */
  public refresh() {
    viewport.setContainer(this.container);
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

    if (isSource && this.conduit) {
      this.send("section:added", section.data);
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
    this.container.innerHTML = "";
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Event = "ready" | "loaded" | "section" | "edit";

type EventHandler = (...args: any) => void;

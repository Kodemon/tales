import { EventEmitter } from "eventemitter3";
import * as rndm from "rndm";

import { Conduit } from "./Conduit";
import { Source } from "./Enums";
import { Section } from "./Section";
import { insertElementAfter, moveArrayIndex } from "./Utils";
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
   * @param index
   * @param source
   */
  public addSection(data: any, index: number, source: Source = Source.Silent) {
    const section = new Section(this, {
      id: data.id || rndm.base62(10),
      settings: data.settings || {},
      stacks: data.stacks || []
    });

    const target = this.sections[index - 1];
    if (target) {
      insertElementAfter(section.element, target.element);
    }

    this.sections.splice(index, 0, section);

    section.render();

    this.cache();
    this.emit("refresh");

    if (source === Source.User) {
      this.emit("edit", section);
      this.send("section:added", this.id, section.data);
    }

    return section;
  }

  /**
   * Get a section from the page.
   *
   * @param id
   *
   * @returns stack instance
   */
  public getSection(id: string) {
    return this.sections.find(c => c.id === id);
  }

  /**
   * Get the raw section data from the page.
   *
   * @param id
   *
   * @returns section data
   */
  public getSectionData(id: string) {
    const section = this.sections.find(c => c.id === id);
    if (section) {
      section.data;
    }
  }

  /**
   * Moves a section to a new position on the page.
   *
   * @param prevIndex
   * @param nextIndex
   */
  public moveSection(prevIndex: number, nextIndex: number, source: Source = Source.Silent) {
    if (prevIndex === nextIndex) {
      return; // no need to update, indexes are the same
    }

    const sectionA = this.sections[prevIndex];
    if (!sectionA) {
      return console.error(`Move Section > Could not find the source section at index position ${prevIndex}.`);
    }

    const sectionB = this.sections[nextIndex];
    if (!sectionA) {
      return console.error(`Move Section > Could not find the destination section at index position ${nextIndex}.`);
    }

    this.sections = moveArrayIndex(this.sections, prevIndex, nextIndex);
    this.cache();

    if (prevIndex > nextIndex) {
      this.element.insertBefore(sectionA.element, sectionB.element);
    } else {
      insertElementAfter(sectionA.element, sectionB.element);
    }

    this.emit("refresh");

    if (source === Source.User) {
      this.send("section:move", this.id, prevIndex, nextIndex);
    }
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
    this.emit("refresh");
  }
}

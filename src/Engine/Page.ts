import { EventEmitter } from "eventemitter3";

import { Conduit, ConduitEvent } from "./Conduit";
import { Source } from "./Enums";
import { Section } from "./Section";
import { generateId, insertElementAfter, moveArrayIndex } from "./Utils";
import { viewport } from "./Viewport";
import { worker } from "./Worker";

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
   * Conduit instance when sharing the page.
   * @type {Conduit}
   */
  public conduit?: Conduit;

  /**
   * Page title.
   * @type {string}
   */
  public title: string = "Untitled";

  /**
   * Media assets.
   * @type {any[]}
   */
  public assets: any[] = [];

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
        this.emit(PageEvent.Ready);
      }
    }, 100);

    // ### Webworker

    // worker.addEventListener("message", e => {
    //   console.log(e.data);
    // });
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
    this.title = page.title;
    this.assets = page.assets;

    this.element.innerHTML = "";

    this.sections = [];
    for (const data of page.sections) {
      const section = new Section(this, data);
      this.sections.push(section);
      section.render();
    }

    this.emit(PageEvent.Loaded);
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
      this.conduit = new Conduit();
      this.conduit.once(ConduitEvent.Open, () => {
        registerConduitEventHandlers(this);
        this.emit(PageEvent.Refresh);
      });
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
      this.conduit!.once(ConduitEvent.Open, () => {
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
  | Asset Utilities
  |--------------------------------------------------------------------------------
  */

  /**
   * Adds a new asset to the page asset list.
   *
   * @param data
   * @param source
   */
  public addAsset(data: any, source: Source = Source.Silent) {
    this.assets.push(data);
    this.cache();
    this.emit(PageEvent.Refresh);
    if (source === Source.User) {
      this.send(PageConduitEvent.AssetAdded, this.id, data);
    }
  }

  public removeAsset(publicId: string, source: Source = Source.Silent) {
    this.assets = this.assets.reduce((assets: any[], asset: any) => {
      if (publicId !== asset.public_id) {
        assets.push(asset);
      }
      return assets;
    }, []);
    this.cache();
    this.emit(PageEvent.Refresh);
    if (source === Source.User) {
      this.send(PageConduitEvent.AssetRemoved, this.id, publicId);
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
      id: data.id || generateId(5, "s"),
      settings: data.settings || {},
      stacks: data.stacks || []
    });

    // const target = this.sections[index - 1];
    // if (target) {
    //   insertElementAfter(section.element, target.element);
    // }
    // this.sections.splice(index, 0, section);

    this.sections.push(section);

    section.render();

    this.cache();

    if (source === Source.User) {
      this.emit(PageEvent.Edit, section.id);
      this.send(PageConduitEvent.SectionAdded, this.id, section.data);
    } else {
      this.emit(PageEvent.Refresh);
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

    this.emit(PageEvent.Refresh);

    if (source === Source.User) {
      this.send(PageConduitEvent.SectionMoved, this.id, prevIndex, nextIndex);
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
    localStorage.setItem(`page:${this.id}`, JSON.stringify(this.toJSON()));
  }

  /**
   * Completely flush the page of all content.
   */
  public flush() {
    localStorage.removeItem(`page:${this.id}`);
    this.sections = [];
    this.element.innerHTML = "";
    this.emit(PageEvent.Refresh);
  }

  /**
   * Get a resolved json representation of the page.
   *
   * @returns page as a json object
   */
  public toJSON() {
    return {
      id: this.id,
      title: this.title,
      sections: this.sections.map(s => s.toJSON()),
      assets: this.assets
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Event Handlers
 |--------------------------------------------------------------------------------
 */

function registerConduitEventHandlers(page: Page) {
  const conduit = page.conduit;
  if (conduit) {
    conduit.on(PageConduitEvent.PageLoaded, (conn, data) => {
      page.load(data);
      page.cache();
    });

    // ### Conduit Events

    conduit.on(ConduitEvent.PeerConnected, conn => {
      conduit.sendTo(conn, PageConduitEvent.PageLoaded, page.toJSON());
      page.emit(PageEvent.Refresh);
    });

    conduit.on(ConduitEvent.PeerClosed, () => {
      page.emit(PageEvent.Refresh);
    });

    // ### Asset Events

    conduit.on(PageConduitEvent.SectionAdded, (conn, pageId, data) => {
      if (pageId === page.id) {
        page.addAsset(data);
      }
    });

    // ### Section Events

    conduit.on(PageConduitEvent.SectionAdded, (conn, pageId, data) => {
      if (pageId === page.id) {
        page.addSection(data);
      }
    });

    conduit.on(PageConduitEvent.SectionSet, (conn, pageId, sectionId, key, value) => {
      if (pageId === page.id) {
        const section = page.getSection(sectionId);
        if (section) {
          section.set(key, value);
        }
      }
    });

    conduit.on(PageConduitEvent.SectionMoved, (conn, pageId, prevIndex, nextIndex) => {
      if (pageId === page.id) {
        page.moveSection(prevIndex, nextIndex);
      }
    });

    conduit.on(PageConduitEvent.SectionRemoved, (conn, pageId, sectionId) => {
      if (pageId === page.id) {
        const section = page.getSection(sectionId);
        if (section) {
          section.remove();
        }
      }
    });

    // ### Stack Events

    conduit.on(PageConduitEvent.StackAdded, (conn, pageId, sectionId, data) => {
      if (pageId === page.id) {
        const section = page.getSection(sectionId);
        if (section) {
          section.addStack(data);
        }
      }
    });

    conduit.on(PageConduitEvent.StackSet, (conn, pageId, sectionId, stackId, key, value) => {
      if (pageId === page.id) {
        const section = page.getSection(sectionId);
        if (section) {
          const stack = section.getStack(stackId);
          if (stack) {
            stack.set(key, value);
          }
        }
      }
    });

    conduit.on(PageConduitEvent.StackMoved, (conn, pageId, sectionId, prevIndex, nextIndex) => {
      if (pageId === page.id) {
        const section = page.getSection(sectionId);
        if (section) {
          section.moveStack(prevIndex, nextIndex);
        }
      }
    });

    conduit.on(PageConduitEvent.StackRemoved, (conn, pageId, sectionId, stackId) => {
      if (pageId === page.id) {
        const section = page.getSection(sectionId);
        if (section) {
          const stack = section.getStack(stackId);
          if (stack) {
            stack.remove();
          }
        }
      }
    });

    // ### Component Events

    conduit.on(PageConduitEvent.ComponentAdded, (conn, pageId, sectionId, stackId, data) => {
      if (pageId === page.id) {
        const section = page.getSection(sectionId);
        if (section) {
          const stack = section.getStack(stackId);
          if (stack) {
            stack.addComponent(data);
          }
        }
      }
    });

    conduit.on(PageConduitEvent.ComponentSet, (conn, pageId, sectionId, stackId, componentId, key, value) => {
      if (pageId === page.id) {
        const section = page.getSection(sectionId);
        if (section) {
          const stack = section.getStack(stackId);
          if (stack) {
            const component = stack.getComponent(componentId);
            if (component) {
              component.set(key, value);
            }
          }
        }
      }
    });

    conduit.on(PageConduitEvent.ComponentRemoved, (conn, pageId, sectionId, stackId, componentId) => {
      if (pageId === page.id) {
        const section = page.getSection(sectionId);
        if (section) {
          const stack = section.getStack(stackId);
          if (stack) {
            const component = stack.getComponent(componentId);
            if (component) {
              component.remove();
            }
          }
        }
      }
    });

    // ### Quill Events

    conduit.on(PageConduitEvent.Quill, (conn, componentId, data) => {
      page.emit(PageConduitEvent.Quill, componentId, data);
    });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Enums
 |--------------------------------------------------------------------------------
 */

export enum PageEvent {
  /**
   * Triggered when the page container has been successfully resolved.
   */
  Ready = "ready",

  /**
   * Triggered when the page has succesfully loaded a cached page file.
   */
  Loaded = "loaded",

  /**
   * Triggered when changes has occured within the page.
   */
  Refresh = "refresh",

  /**
   * Triggered when the page is in editing mode and a interactable element
   * was clicked. All params are optional.
   *
   * @param sectionId
   * @param stackId
   * @param componentId
   */
  Edit = "edit"
}

export enum PageConduitEvent {
  /**
   * Triggered when a peer has successfully sent the client a cached page.
   *
   * @param conn
   * @param pageId
   * @param data
   */
  PageLoaded = "page:loaded",

  /**
   * Triggered when a page asset is removed.
   *
   * @param conn
   * @param pageId
   * @param data
   */
  AssetAdded = "asset:added",

  /**
   * Triggered when a page asset is removed.
   *
   * @param conn
   * @param data
   */
  AssetRemoved = "asset:removed",

  /**
   * Triggered when a section has been added.
   *
   * @param conn
   * @param pageId
   * @param data
   */
  SectionAdded = "section:added",

  /**
   * Triggered when a section setting has been added/modified/removed.
   *
   * @param conn
   * @param pageId
   * @param sectionId
   * @param key
   * @param value
   */
  SectionSet = "section:set",

  /**
   * Triggered when a section has been moved to another position in the
   * section array.
   */
  SectionMoved = "section:moved",

  /**
   * Triggered when a section has been removed.
   *
   * @param conn
   * @param pageId
   * @param sectionId
   */
  SectionRemoved = "section:removed",

  /**
   * Triggered when a stack has been added to a section.
   */
  StackAdded = "stack:added",

  /**
   * Triggered when a stack setting has been added/modified/removed.
   */
  StackSet = "stack:set",

  /**
   * Triggered when a stack has been moved to another position in the
   * section array.
   */
  StackMoved = "stack:moved",

  /**
   * Triggered when a stack has been removed.
   *
   * @param conn
   * @param pageId
   * @param sectionId
   * @param stackId
   */
  StackRemoved = "stack:removed",

  /**
   * Triggered when a stack has been added to a stack.
   */
  ComponentAdded = "component:added",

  /**
   * Triggered when a component setting has been added/modified/removed.
   */
  ComponentSet = "component:set",

  /**
   * Triggered when a component has been removed.
   *
   * @param conn
   * @param pageId
   * @param sectionId
   * @param stackId
   * @param componentId
   */
  ComponentRemoved = "component:removed",

  /**
   * Triggered when quill state has been modified.
   */
  Quill = "quill"
}

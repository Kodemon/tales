import * as debug from "debug";
import { EventEmitter } from "eventemitter3";
import { Page } from "./Page";

const TIMEOUT = 5;

const log = debug("conduit");

export class Conduit extends EventEmitter {
  /**
   * Page this conduit affects on events.
   * @type {Page}
   */
  public page: Page;

  /**
   * Peer session.
   * @type {Peer}
   */
  public peer: Peer;

  /**
   * List of active peer data connections.
   * @type {Peer.DataConnection}
   */
  public list: Set<Peer.DataConnection> = new Set();

  constructor(page: Page) {
    super();

    this.page = page;
    this.peer = new Peer();

    this.load();
  }

  /*
  |--------------------------------------------------------------------------------
  | Peer Getters
  |--------------------------------------------------------------------------------
  */

  get id() {
    return this.peer.id;
  }

  /*
  |--------------------------------------------------------------------------------
  | Connection Utilities
  |--------------------------------------------------------------------------------
  */

  /**
   * Establish a connection with another peer.
   *
   * @param peer
   */
  public connect(peer: string) {
    this.storeConnection(this.peer.connect(peer));
  }

  /*
  |--------------------------------------------------------------------------------
  | Event Utilities
  |--------------------------------------------------------------------------------
  */

  /**
   * Send a new event to the provided connection.
   *
   * @param conn
   * @param type
   * @param args
   */
  public sendTo(conn: Peer.DataConnection, type: string, ...args: any) {
    log("sending", type, args);
    conn.send(JSON.stringify({ type, args }));
  }

  /*
  |--------------------------------------------------------------------------------
  | Private Loaders
  |--------------------------------------------------------------------------------
  */

  /**
   * Set up all the conduit event listeners.
   */
  private load() {
    this.peer.on("connection", conn => {
      this.storeConnection(conn);

      conn.on("open", () => {
        this.sendTo(conn, "page:load", {
          id: this.page.id,
          title: "Unknown",
          sections: this.page.sections.map(s => s.toJSON())
        });
      });
    });

    // ### Opened

    this.peer.on("open", () => {
      this.page.emit("conduit:open");
    });

    // ### Page Events

    this.on("page:load", (conn, data) => {
      this.page.load(data);
      this.page.cache();
    });

    // ### Section Events

    this.on("section:added", (conn, pageId, data) => {
      if (pageId === this.page.id) {
        this.page.addSection(data);
      }
    });

    this.on("section:set", (conn, pageId, sectionId, key, value) => {
      if (pageId === this.page.id) {
        const section = this.page.sections.find(s => s.id === sectionId);
        if (section) {
          section.set(key, value);
        }
      }
    });

    // ### Stack Events

    this.on("stack:added", (conn, pageId, sectionId, data) => {
      if (pageId === this.page.id) {
        const section = this.page.sections.find(s => s.id === sectionId);
        if (section) {
          section.addStack(data);
        }
      }
    });

    this.on("stack:set", (conn, pageId, sectionId, stackId, key, value) => {
      if (pageId === this.page.id) {
        const section = this.page.sections.find(s => s.id === sectionId);
        if (section) {
          const stack = section.stacks.find(s => s.id === stackId);
          if (stack) {
            stack.set(key, value);
          }
        }
      }
    });

    // ### Component Events

    this.on("component:added", (conn, pageId, sectionId, stackId, data) => {
      if (pageId === this.page.id) {
        const section = this.page.sections.find(s => s.id === sectionId);
        if (section) {
          const stack = section.stacks.find(s => s.id === stackId);
          if (stack) {
            stack.addComponent(data);
          }
        }
      }
    });

    this.on("component:set", (conn, pageId, sectionId, stackId, componentId, key, value) => {
      if (pageId === this.page.id) {
        const section = this.page.sections.find(s => s.id === sectionId);
        if (section) {
          const stack = section.stacks.find(s => s.id === stackId);
          if (stack) {
            const component = stack.components.find(c => c.id === componentId);
            if (component) {
              component.set(key, value);
            }
          }
        }
      }
    });

    // ### Quill Events

    this.on("quill:delta", (conn, componentId, data) => {
      this.page.emit("quill:delta", componentId, data);
    });

    // ### Cleanup

    window.addEventListener("beforeunload", () => {
      this.peer.disconnect();
      this.peer.destroy();
    });
  }

  /**
   * Stores a new data connection.
   *
   * @param conn
   */
  private storeConnection(conn: Peer.DataConnection) {
    log("storing connection %o", conn);

    conn.on("data", (data: any) => {
      const { type, args } = JSON.parse(data);
      console.log("Received data: ", type, args);
      this.emit(type, conn, ...args);
    });

    conn.on("close", () => {
      log("peer closed %o", conn);
      this.list.delete(conn);
      this.page.emit("refresh");
    });

    conn.on("error", err => {
      console.log(err);
    });

    this.list.add(conn);

    this.page.emit("refresh");

    // ### Heartbeat

    let lastChecked = new Date().getTime() / 1000;

    const ping = (c: Peer.DataConnection) => {
      if (c.peer === conn.peer) {
        lastChecked = new Date().getTime() / 1000;
      }
    };

    const heartbeat = setInterval(() => {
      this.sendTo(conn, "ping");
    }, TIMEOUT * 1000);

    const activePeerCheck = setInterval(() => {
      const isActive = lastChecked + TIMEOUT * 2 > Math.ceil(new Date().getTime() / 1000);
      if (!isActive) {
        log("peer closed %o", conn);

        clearInterval(activePeerCheck);
        clearInterval(heartbeat);

        this.off("ping", ping);

        this.list.delete(conn);
        this.page.emit("refresh");
      }
    }, (TIMEOUT / 2) * 1000);

    this.on("ping", ping);
  }
}

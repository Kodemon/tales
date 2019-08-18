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
   * Sends a new event to all connected connections.
   *
   * @param type
   * @param args
   */
  public send(type: ConduitType, ...args: any) {
    log("sending", type, args);
    this.list.forEach(conn => {
      conn.send(JSON.stringify({ type, args }));
    });
  }

  /**
   * Send a new event to the provided connection.
   *
   * @param conn
   * @param type
   * @param args
   */
  public sendTo(conn: Peer.DataConnection, type: ConduitType, ...args: any) {
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
        this.sendTo(conn, "page:load", this.page.sections.map(s => s.data));
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

    this.on("section:added", (conn, data) => {
      this.page.addSection(data);
    });

    this.on("section:setting", (conn, sectionId, key, value) => {
      const section = this.page.sections.find(s => s.id === sectionId);
      if (section) {
        section.setSetting(key, value);
      }
    });

    // ### Component Events

    this.on("component:added", (conn, sectionId, data) => {
      const section = this.page.sections.find(s => s.id === sectionId);
      if (section) {
        section.addComponent(data);
      }
    });

    this.on("component:set", (conn, sectionId, componentId, key, value) => {
      const section = this.page.sections.find(s => s.id === sectionId);
      if (section) {
        const component = section.components.find(c => c.id === componentId);
        if (component) {
          component.set(key, value);
        }
      }
    });

    this.on("component:setting", (conn, sectionId, componentId, key, value) => {
      const section = this.page.sections.find(s => s.id === sectionId);
      if (section) {
        const component = section.components.find(c => c.id === componentId);
        if (component) {
          component.setSetting(key, value);
        }
      }
    });

    this.on("component:style", (conn, sectionId, componentId, key, value) => {
      const section = this.page.sections.find(s => s.id === sectionId);
      if (section) {
        const component = section.components.find(c => c.id === componentId);
        if (component) {
          component.setStyle(key, value);
        }
      }
    });

    this.on("component:removed", (conn, sectionId, componentId) => {
      const section = this.page.sections.find(s => s.id === sectionId);
      if (section) {
        const component = section.components.find(c => c.id === componentId);
        if (component) {
          component.remove();
        }
      }
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

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type ConduitType =
  | "ping"
  | "page:load"
  | "section:added"
  | "section:setting"
  | "section:removed"
  | "component:added"
  | "component:set"
  | "component:setting"
  | "component:style"
  | "component:removed";

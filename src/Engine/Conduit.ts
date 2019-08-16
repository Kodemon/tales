import * as debug from "debug";
import { EventEmitter } from "eventemitter3";
import { Page } from "./Page";

const log = debug("conduit");

export class Conduit extends EventEmitter {
  /**
   * Page this conduit affects on events.
   * @type {Page}
   */
  private _page: Page;

  /**
   * Peer session.
   * @type {Peer}
   */
  private _peer: Peer;

  /**
   * List of active peer data connections.
   * @type {Peer.DataConnection}
   */
  private _list: Set<Peer.DataConnection> = new Set();

  constructor(page: Page) {
    super();

    this._page = page;
    this._peer = new Peer();

    this._setup();
  }

  /*
  |--------------------------------------------------------------------------------
  | Peer Getters
  |--------------------------------------------------------------------------------
  */

  get id() {
    return this._peer.id;
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
    this._storeConnection(this._peer.connect(peer));
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
    this._list.forEach(conn => {
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
  private _setup() {
    this._peer.on("connection", conn => {
      this._storeConnection(conn);
      conn.on("open", () => {
        this.sendTo(conn, "page:load", this._page.sections.map(s => s.data));
      });
    });

    this.on("page:load", (conn, data) => {
      this._page.load(data);
      this._page.cache();
    });

    // ### Section Events

    this.on("section:added", (conn, data) => {
      this._page.addSection(data);
    });

    this.on("section:setting", (conn, sectionId, key, value) => {
      const section = this._page.sections.find(s => s.id === sectionId);
      if (section) {
        section.set(key, value);
      }
    });

    // ### Component Events

    this.on("component:added", (conn, sectionId, data) => {
      const section = this._page.sections.find(s => s.id === sectionId);
      if (section) {
        section.addComponent(data);
      }
    });

    this.on("component:set", (conn, sectionId, componentId, key, value) => {
      const section = this._page.sections.find(s => s.id === sectionId);
      if (section) {
        const component = section.components.find(c => c.id === componentId);
        if (component) {
          component.set(key, value);
        }
      }
    });

    this.on("component:setting", (conn, sectionId, componentId, key, value) => {
      const section = this._page.sections.find(s => s.id === sectionId);
      if (section) {
        const component = section.components.find(c => c.id === componentId);
        if (component) {
          component.setSetting(key, value);
        }
      }
    });

    this.on("component:style", (conn, sectionId, componentId, key, value) => {
      const section = this._page.sections.find(s => s.id === sectionId);
      if (section) {
        const component = section.components.find(c => c.id === componentId);
        if (component) {
          component.setStyle(key, value);
        }
      }
    });

    this.on("component:removed", (conn, sectionId, componentId) => {
      const section = this._page.sections.find(s => s.id === sectionId);
      if (section) {
        section.removeComponent(componentId);
      }
    });
  }

  /**
   * Stores a new data connection.
   *
   * @param conn
   */
  private _storeConnection(conn: Peer.DataConnection) {
    log("storing connection %o", conn);

    conn.on("data", (data: any) => {
      const { type, args } = JSON.parse(data);
      this.emit(type, conn, ...args);
    });

    conn.on("close", () => {
      log("peer closed %o", conn);
      this._list.delete(conn);
    });

    this._list.add(conn);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type ConduitType =
  | "page:load"
  | "section:added"
  | "section:setting"
  | "section:removed"
  | "component:added"
  | "component:set"
  | "component:setting"
  | "component:style"
  | "component:removed";

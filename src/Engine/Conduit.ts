import * as debug from "debug";
import { EventEmitter } from "eventemitter3";
import { Page } from "./Page";
import { generateId } from "./Utils";

const TIMEOUT = 5;

const log = debug("conduit");

export class Conduit extends EventEmitter {
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

  constructor() {
    super();
    this.peer = new Peer(generateId(5, "tlz"));
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
        this.emit(ConduitEvent.PeerConnected, conn);
      });
    });

    // ### Opened

    this.peer.on("open", () => {
      this.emit(ConduitEvent.Open);
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
      this.emit(ConduitEvent.PeerClosed, conn);
    });

    conn.on("error", err => {
      console.log(err);
    });

    this.list.add(conn);

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
        this.emit(ConduitEvent.PeerClosed);
      }
    }, (TIMEOUT / 2) * 1000);

    this.on("ping", ping);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Enums
 |--------------------------------------------------------------------------------
 */

export enum ConduitEvent {
  /**
   * Triggered when the conduit instance is succesfully connected to the broker.
   */
  Open = "conduit:open",

  /**
   * Triggered when a peer has connected.
   *
   * @param conn
   */
  PeerConnected = "conduit:peer:connected",

  /**
   * Triggered when a peer connection was closed.
   *
   * @param conn
   */
  PeerClosed = "conduit:peer:closed"
}

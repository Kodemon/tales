import { Collection, Db as MongoDb, MongoClient } from "mongodb";

import { config } from "../Config";

const nodes: Nodes = {};

/**
 * Provides a collection to query on the default database.
 *
 * @param name
 * @param queryFn
 *
 * @returns result from the collection query
 */
export async function collection<TSchema = any>(name: string, queryFn: (query: Collection<TSchema>) => Promise<any>) {
  return queryFn((await mongodb()).collection<TSchema>(name));
}

/**
 * Returns a database connection.
 *
 * @param name
 * @param handler
 *
 * @returns connected mongodb instance or handler result.
 */
export async function mongodb(options?: any): Promise<MongoDb>;
export async function mongodb(options?: string, handler?: (db: MongoDb) => Promise<any>): Promise<any>;
export async function mongodb(options: any = config.mongodb, handler?: (db: MongoDb) => Promise<any>): Promise<MongoDb | any> {
  if (!nodes[options.name]) {
    nodes[options.name] = new MongoNode(options.name, options.url);
  }
  const db = await nodes[options.name].connect();
  if (handler) {
    return handler(db);
  }
  return db;
}

/*
 |--------------------------------------------------------------------------------
 | Mongo Node
 |--------------------------------------------------------------------------------
*/

export class MongoNode {
  /**
   * MongoDB Client Instance.
   * @type {MongoClient}
   */
  public client?: MongoClient;

  /**
   * Instantiate a new mongodb connection.
   *
   * @param name Database name.
   * @param url Database connection endpoint.
   */
  constructor(public name: string, public url: string) {}

  /**
   * Connects to the mongodb database, stores, and returns a DB instance.
   *
   * @returns {Promise<MongoDb>}
   */
  public async connect(): Promise<MongoDb> {
    if (this.client) {
      return this.client.db(this.name);
    }
    this.client = await MongoClient.connect(this.url, { poolSize: 10, useNewUrlParser: true, ignoreUndefined: false, useUnifiedTopology: true });
    this.client.on("close", () => {
      this.client = undefined;
    });
    return this.client.db(this.name);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Interfaces
 |--------------------------------------------------------------------------------
*/

interface Nodes {
  [name: string]: MongoNode;
}

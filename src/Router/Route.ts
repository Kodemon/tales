import * as pathToRegExp from "path-to-regexp";
import * as rndm from "rndm";

import { Params } from "./Params";
import { Query } from "./Query";
import { State } from "./State";

/*
 |--------------------------------------------------------------------------------
 | Route
 |--------------------------------------------------------------------------------
*/

export class Route {
  public readonly components: any[] = [];

  public readonly title?: string;
  public readonly id: string;
  public readonly path: string;
  public readonly regExp: RegExp;
  public readonly params: RouteParameter[];
  public readonly policies: Policy[];

  public readonly before?: () => Promise<any>;
  public readonly after?: () => void;

  /**
   * Creates a new 'Route' instance.
   *
   * @param components
   * @param options
   */
  constructor(components: any | any[], options: RouteOptions) {
    this.components = Array.isArray(components) ? components : [components];

    this.title = options.title;
    this.id = options.id || rndm.base62(12);
    this.path = options.path;
    this.regExp = pathToRegExp(options.path);
    this.params = parseParams(options.path);
    this.policies = options.policies || [];
    this.before = options.before;
    this.after = options.after;
  }

  /**
   * Matches the route against provided path.
   *
   * @param path
   *
   * @returns {any}
   */
  public match(path: string): any {
    return this.regExp.exec(path);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Helper Functions
 |--------------------------------------------------------------------------------
*/

/**
 * Parse parameters for the provided path.
 *
 * @param path
 *
 * @returns {RouteParameter[]}
 */
function parseParams(path: string): RouteParameter[] {
  return path.split("/").reduce((list: RouteParameter[], next: string) => {
    if (next.match(/:/)) {
      list.push({
        name: next.replace(":", ""),
        value: undefined
      });
    }
    return list;
  }, []);
}

/*
 |--------------------------------------------------------------------------------
 | Enums, Interfaces, and Types
 |--------------------------------------------------------------------------------
*/

export interface RouteParameter {
  name: string;
  value?: string;
}

interface RouteOptions {
  /**
   * Identifier, useful for determine active route in app components.
   * @type {string}
   */
  id: string;

  /**
   * Policies to run before executing the route.
   * @type {Policy[]}
   */
  policies?: Policy[];

  /**
   * Title to inject into the header title element.
   * @type {string}
   */
  title?: string;

  /**
   * Raw routing path, eg. /users/:slug
   * @type {string}
   */
  path: string;

  /**
   * Executes before the route is rendered.
   * @type {(() => Promise<any>)}
   */
  before?(): Promise<any>;

  /**
   * Executes after the routed has been rendered.
   * @type {(() => void)}
   */
  after?(): void;
}

/**
 * Route policy executed before a route is commited to the router.
 *
 * @param state
 *
 * @returns {Promise<void>}
 */
export type Policy = (state: PolicyState) => Promise<void>;

interface PolicyState {
  route: Route;
  query: Query;
  params: Params;
  state: State;
}

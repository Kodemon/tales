import { History, Location } from "history";

import { Params } from "./Params";
import { Query } from "./Query";
import { Route } from "./Route";
import { State } from "./State";

/*
 |--------------------------------------------------------------------------------
 | Router
 |--------------------------------------------------------------------------------
*/

export class Router {
  /**
   * Browser history handler.
   * @type {History}
   */
  public readonly history: History;

  /**
   * Registered routes.
   * @type {Route[]}
   */
  public routes: Route[] = [];

  /**
   * Active query of the resolved route.
   * @type {Query}
   */
  public query: Query;

  /**
   * Active parameters of the resolved route.
   * @type {Params}
   */
  public params: Params;

  /**
   * Active state of the resolved route.
   * @type {State}
   */
  public state: State;

  /**
   * Active resolved route.
   * @type {Route}
   */
  public route: Route;

  /**
   * Active history location instance.
   * @type {Location }
   */
  public location: Location;

  /**
   * Creates a new 'Router' instance.
   *
   * @param history
   */
  constructor(history: History) {
    this.history = history;
    this.query = new Query(history);
    this.params = new Params();
    this.state = new State();
  }

  /**
   * Start listening to transition requests.
   *
   * @param handler
   */
  public listen(handler: Handler) {
    this.history.listen(async (location: Location) => {
      const result = this.get(location.pathname);
      if (result) {
        const route = result.route;
        const state = new State(location.state);
        const query = new Query(this.history, location.search);
        const params = getParams(result);

        // ### Preloader

        if (handler.preload) {
          await handler.preload({ route, query, params, state });
        }

        // ### Policies
        // If policies has been defined, validate each policy before
        // assigning, and routing the request.

        for (const policy of route.policies) {
          try {
            await policy({ route, query, params, state });
          } catch (err) {
            return handler.error(err);
          }
        }

        // ### Update Router
        // Set the new location, query, params, and route to the router.

        this.route = route;
        this.location = location; // store the current location
        this.state = state;
        this.query = query;
        this.params = params;

        // ### Render
        // Execute the defined render handler.

        try {
          await handler.render(result.route, location);
        } catch (err) {
          handler.error(err);
        }
      } else {
        handler.error({
          status: 404,
          code: "ROUTE_NOT_FOUND",
          message: "Route does not exist, or has been moved to another location."
        });
      }
    });
  }

  /**
   * Redirect the client to the provided pathname/link.
   *
   * @param path The path value.
   * @param state The state.
   */
  public goTo(path: string, state: object = {}) {
    this.history.push(path, state);
  }

  /**
   * Refreshes the current route, acts like a force reload.
   */
  public refresh() {
    if (this.location) {
      const { pathname, search, hash, state } = this.location;
      this.history.push(`${pathname}${search}${hash}`, state);
    }
  }

  /**
   * Registers provided routes with the router.
   *
   * @param routes
   */
  public register(routes: Route[]) {
    for (const route of routes) {
      this.routes.push(route);
    }
  }

  /**
   * Returns a route that validates against the given path.
   *
   * @param path Routing path to return.
   *
   * @returns route or undefined
   */
  public get(path: string): RouteResult | undefined {
    for (const route of this.routes) {
      const match: boolean = route.match(path);
      if (match) {
        return {
          route,
          match
        };
      }
    }
    return undefined;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Helper Functions
 |--------------------------------------------------------------------------------
*/

/**
 * Retrieve routing parameters from the provided route result container.
 *
 * @param container
 *
 * @returns route parameters
 */
function getParams(container: RouteResult) {
  const params = container.route.params;
  const result: any = {};
  let index: number = 1;
  for (const param of params) {
    result[param.name] = container.match[index];
    index += 1;
  }
  return new Params(result);
}

/*
 |--------------------------------------------------------------------------------
 | Enums, Interfaces, and Types
 |--------------------------------------------------------------------------------
*/

interface Handler {
  /**
   * Preloads any required entities before a route, and its potential policies
   * are executed.
   */
  preload?(data: { route: Route; query: Query; params: Params; state: State }): Promise<void>;

  /**
   * Render routed view template and component.
   *
   * @param route The route to render.
   * @param location The current history location.
   */
  render(route: Route, location: Location): void;

  /**
   * Handles an error that occurs during a routing request.
   *
   * @param error The error reported during invalid routing.
   */
  error(error: any): void;
}

interface RouteResult {
  route: Route;
  match: any;
}

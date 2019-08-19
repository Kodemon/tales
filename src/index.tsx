import * as React from "react";
import * as ReactDOM from "react-dom";

import { Dashboard } from "./App/Dashboard";
import { Editor } from "./App/Editor";
import { Reader } from "./App/Reader";
import { Site } from "./App/Site";
import { Page } from "./Engine/Page";
import { Route, router } from "./Router";

declare global {
  interface Window {
    page: Page;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Routes
 |--------------------------------------------------------------------------------
 */

router.register([
  new Route(Dashboard, {
    id: "dashboard",
    path: "/"
  }),
  new Route(Site, {
    id: "site",
    path: "/sites/:site"
  }),
  new Route(Reader, {
    id: "reader",
    path: "/read/:page"
  }),
  new Route(Editor, {
    id: "editor",
    path: "/edit/:page"
  })
]);

/*
 |--------------------------------------------------------------------------------
 | App
 |--------------------------------------------------------------------------------
 */

router.listen({
  async render(route) {
    ReactDOM.render(createReactElement(route.components), document.getElementById("app"));
  },

  error(err) {
    console.log(err);
  }
});

/**
 * Returns a compiled react element from a possible multiple route components.
 *
 * @param list List of route components to compile.
 * @param props The root properties to pass down.
 */
function createReactElement(list: any[], props: any = {}): any {
  const Component = list.shift();
  if (list.length > 0) {
    return React.createElement(Component, props, createReactElement(list, props));
  }
  return React.createElement(Component, props);
}

/*
 |--------------------------------------------------------------------------------
 | Bootstrap
 |--------------------------------------------------------------------------------
 */

const { pathname, search, state } = router.history.location;

router.goTo(`${pathname}${search}`, state);

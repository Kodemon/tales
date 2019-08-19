import { createBrowserHistory } from "history";

import { Router } from "./Router";

/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
*/

export * from "./Route";

export const router = new Router(createBrowserHistory());

/*
 |--------------------------------------------------------------------------------
 | Development Debug
 |--------------------------------------------------------------------------------
 |
 | When router is not running production, we attach it to the window global
 | object for debugging purposes. Allowing us to view its current instanced state
 | without having to console log in code.
 |
*/

declare global {
  interface Window {
    router: Router;
  }
}

if (process.env.NODE_ENV !== "production") {
  window.router = router;
}

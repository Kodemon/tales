import * as React from "react";

import { Page } from "Engine/Page";

import { router } from "../Router";
import { Viewport } from "./Style";

export class Reader extends React.Component {
  private content: HTMLDivElement | null;
  private page: Page;

  public componentDidMount() {
    window.page = this.page = new Page(this.content, {
      id: router.params.get("page"),
      editing: false
    }).on("ready", () => {
      if (router.query.has("peer")) {
        localStorage.removeItem(`page:${router.params.get("page")}`);
        this.page.connect(router.query.get("peer"));
      } else {
        const cache = localStorage.getItem(`page:${router.params.get("page")}`);
        if (cache) {
          this.page.load(JSON.parse(cache));
        }
      }
    });
  }

  public render() {
    return <Viewport ref={c => (this.content = c)} style={{ border: "none", height: "100vh", width: "100vw" }} />;
  }
}

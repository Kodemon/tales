import * as React from "react";

import { Page } from "Engine/Page";

import { router } from "../Router";

export class Reader extends React.Component {
  private content: HTMLDivElement | null;
  private page: Page;

  public componentDidMount() {
    window.page = this.page = new Page(this.content, {
      id: router.params.get("page"),
      editing: false
    }).on("ready", () => {
      const cache = localStorage.getItem(`page.${router.params.get("page")}`);
      if (cache) {
        this.page.load(JSON.parse(cache));
      }
      if (router.query.has("peer")) {
        this.page.connect(router.query.get("peer"));
      }
    });
  }

  public render() {
    return <div ref={c => (this.content = c)} style={{ height: "100vh", width: "100vw" }} />;
  }
}

import * as React from "react";

import { Page } from "Engine/Page";

import { router } from "../Router";
import { Content } from "./Editor/Styles";

export class Reader extends React.Component {
  private content: HTMLDivElement | null;
  private page: Page;

  public componentDidMount() {
    window.page = this.page = new Page(router.params.get("page"), this.content).on("ready", () => {
      const cache = localStorage.getItem(`page.${router.params.get("page")}`);
      if (cache) {
        this.page.load(JSON.parse(cache));
      }
      if (router.query.has("peer")) {
        this.page.on("conduit:open", () => {
          this.page.connect(router.query.get("peer"));
        });
      }
    });
  }

  public render() {
    return <Content ref={c => (this.content = c)} style={{ height: "100%", width: "100%" }} />;
  }
}

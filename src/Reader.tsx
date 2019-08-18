import * as React from "react";

import { Page } from "Engine/Page";

import { Content } from "./Editor/Styles";

declare global {
  interface Window {
    page: Page;
  }
}

const urlParams = new URLSearchParams(window.location.search);
const peerId = urlParams.get("peer");

export class Reader extends React.Component {
  private content: HTMLDivElement | null;
  private page: Page;

  public componentDidMount() {
    window.page = this.page = new Page(this.content).on("ready", () => {
      const cache = localStorage.getItem("page");
      if (cache) {
        this.page.load(JSON.parse(cache));
      }
      if (peerId) {
        this.page.on("conduit:open", () => {
          this.page.connect(peerId);
        });
      }
    });
  }

  public render() {
    return <Content ref={c => (this.content = c)} style={{ height: "100%", width: "100%" }} />;
  }
}

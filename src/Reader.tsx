import * as React from "react";

import { Page } from "Engine/Page";

declare global {
  interface Window {
    page: Page;
  }
}

export class Reader extends React.Component {
  private content: HTMLDivElement | null;
  private page: Page;

  public componentDidMount() {
    window.page = this.page = new Page(this.content).on("ready", () => {
      const cache = localStorage.getItem("page");
      if (cache) {
        this.page.load(JSON.parse(cache));
      }
    });
  }

  public render() {
    return <div ref={c => (this.content = c)} style={{ height: "100%", width: "100%" }} />;
  }
}

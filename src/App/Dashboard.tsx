import * as React from "react";
import * as rndm from "rndm";

import { router } from "../Router";

export class Dashboard extends React.Component {
  public componentDidMount() {
    const pages = [];
    for (const key in localStorage) {
      if (key.match("page.")) {
        const page = localStorage.getItem(key);
        console.log(page);
      }
    }
  }

  private createPage = () => {
    router.goTo(`/edit/${rndm.base62(10)}`);
  };

  public render() {
    return (
      <div>
        Dashboard{" "}
        <button type="button" onClick={this.createPage}>
          Create Page
        </button>
      </div>
    );
  }
}

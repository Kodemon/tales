import * as React from "react";
import * as rndm from "rndm";

import { router } from "../Router";

export class Site extends React.Component<
  {},
  {
    site: any;
    pages: any[];
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      site: undefined,
      pages: []
    };
  }

  public componentDidMount() {
    const pages: any[] = [];
    const cache = localStorage.getItem(`site.${router.params.get("site")}`);

    for (const key in localStorage) {
      if (key.match("page.")) {
        pages.push(JSON.parse(localStorage.getItem(key) || ""));
      }
    }

    const site = JSON.parse(cache || "");

    this.setState(() => ({ site, pages }));
  }

  private createPage = () => {
    const id = rndm.base62(10);
    localStorage.setItem(
      `page.${id}`,
      JSON.stringify({
        id,
        title: "Unknown",
        sections: []
      })
    );
    router.goTo(`/edit/${id}`);
  };

  public render() {
    const { site, pages } = this.state;
    if (!site) {
      return <div>loading...</div>;
    }

    return (
      <div>
        <h1>Site - {site.title}</h1>
        <section>
          <ul>
            <li>
              <button type="button" onClick={this.createPage}>
                New Page
              </button>
            </li>
          </ul>
        </section>
        <section>
          <ul>
            {pages.map(page => (
              <li key={page.id}>{page.title}</li>
            ))}
          </ul>
        </section>
      </div>
    );
  }
}

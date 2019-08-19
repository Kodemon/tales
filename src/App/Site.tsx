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
    const sites = JSON.parse(localStorage.getItem("sites") || "[]");
    if (sites) {
      const site = sites.find((s: any) => s.id === router.params.get("site"));
      if (site) {
        const pages: any[] = [];
        for (const pageId of site.pages) {
          const cache = localStorage.getItem(`page.${pageId}`);
          if (cache) {
            const page = JSON.parse(cache);
            pages.push({
              id: page.id,
              title: page.title
            });
          }
        }
        this.setState(() => ({ site, pages }));
      }
    }
  }

  private createPage = () => {
    const id = rndm.base62(10);

    const sites = JSON.parse(localStorage.getItem("sites") || "[]");
    if (sites) {
      for (const site of sites) {
        if (site.id === router.params.get("site")) {
          site.pages.push(id);
        }
      }
      localStorage.setItem("sites", JSON.stringify(sites));
    }

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
              <li key={page.id}>
                <button onClick={() => router.goTo(`/edit/${page.id}`)}>{page.title}</button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }
}

import * as React from "react";
import * as rndm from "rndm";

import { router } from "../Router";

export class Dashboard extends React.Component<
  {},
  {
    sites: any[];
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      sites: []
    };
  }

  public componentDidMount() {
    const sites: any[] = [];
    for (const key in localStorage) {
      if (key.match("site.")) {
        sites.push(JSON.parse(localStorage.getItem(key) || ""));
      }
    }
    this.setState(() => ({ sites }));
  }

  private createSite = () => {
    const id = rndm.base62(10);
    localStorage.setItem(
      `site.${id}`,
      JSON.stringify({
        id,
        title: "Untitled Site"
      })
    );
    router.goTo(`/sites/${id}`);
  };

  public render() {
    const { sites } = this.state;
    console.log(sites);
    return (
      <div>
        <h1>Tales</h1>
        <h2>Tell your story</h2>
        <section>
          <h3>Start</h3>
          <ul>
            <li>
              <button type="button" onClick={this.createSite}>
                New Site
              </button>
            </li>
            <li>
              <button type="button" onClick={this.createSite}>
                Open Site...
              </button>
            </li>
            <li>
              <button type="button" onClick={this.createSite}>
                Add existing Site...
              </button>
            </li>
          </ul>
        </section>
        <section>
          <h3>Recent</h3>
          <ul>
            {sites.map(site => (
              <li key={site.id}>
                <a onClick={() => router.goTo(`/sites/${site.id}`)}>{site.title}</a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }
}

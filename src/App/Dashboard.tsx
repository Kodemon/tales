import * as React from "react";
import * as rndm from "rndm";

import { router } from "../Router";

export class Dashboard extends React.Component<
  {},
  {
    sites: any[];
  }
> {
  private sites = JSON.parse(localStorage.getItem("sites") || "[]");

  private createSite = () => {
    const id = rndm.base62(10);
    this.sites.push({
      id,
      title: "Untitled Site",
      pages: []
    });
    localStorage.setItem("sites", JSON.stringify(this.sites));
    router.goTo(`/sites/${id}`);
  };

  public render() {
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
            {this.sites.map((site: any) => (
              <li key={site.id}>
                <button onClick={() => router.goTo(`/sites/${site.id}`)}>{site.title}</button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }
}

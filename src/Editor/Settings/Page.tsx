import * as React from "react";

import { Page } from "Engine/Page";

import { Header, SettingGroup } from "../Styles";

export const PageSettings: React.SFC<{
  page: Page;
}> = function PageSettings({ page }) {
  return (
    <React.Fragment key={`page-${page.conduit.id}`}>
      <Header>
        <h1>Page</h1>
      </Header>
      <div style={{ borderBottom: "1px solid #ccc", padding: 10 }}>
        <SettingGroup>
          <label className="input">Conduit</label>
          <div className="read">{page.conduit.id}</div>
        </SettingGroup>
        <SettingGroup>
          <label className="input">Connect</label>
          <input
            type="text"
            placeholder="Enter conduit peer id"
            onBlur={event => {
              page.connect(event.target.value);
              event.target.value = "";
            }}
          />
        </SettingGroup>
      </div>
    </React.Fragment>
  );
};

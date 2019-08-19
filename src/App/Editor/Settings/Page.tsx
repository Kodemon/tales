import * as React from "react";

import { Page } from "Engine/Page";

import { SettingGroup } from "../Styles";

export const PageSettings: React.SFC<{
  page: Page;
}> = function PageSettings({ page }) {
  return (
    <div key={`page-${page.conduit.id}`} style={{ padding: 10 }}>
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
      <SettingGroup>
        <label className="input">Connected</label>
        <div className="read">
          {Array.from(page.conduit.list).map((conn: any) => {
            return <div key={conn.peer}>{conn.peer}</div>;
          })}
        </div>
      </SettingGroup>
    </div>
  );
};

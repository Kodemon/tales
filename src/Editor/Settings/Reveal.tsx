import * as React from "react";

import { Section } from "Engine/Section";

import { Header, SettingGroup } from "../Styles";

export const RevealSettings: React.SFC<{
  section: Section;
  component: any;
}> = function ImageSettings({ section, component }) {
  return (
    <React.Fragment key={`component-${component.id}`}>
      <div style={{ padding: 10, borderBottom: "1px dashed #ccc" }}>
        <SettingGroup>
          <label className="input">Title</label>
          <input
            type="text"
            defaultValue={component.get("title", "")}
            onBlur={event => {
              component.set("title", event.target.value, true);
            }}
          />
        </SettingGroup>
      </div>
      <div style={{ borderTop: "1px dashed #ccc", padding: 10, textAlign: "center" }}>
        <button
          onClick={() => {
            component.remove(true);
          }}
        >
          Delete Component
        </button>
      </div>
    </React.Fragment>
  );
};

import * as React from "react";

import { Source } from "Engine/Enums";

import { DataSetting } from "../Components/DataSetting";
import { Header, SettingGroup } from "../Styles";

export const YouTubeSettings: React.SFC<{
  component: any;
}> = function YouTubeSettings({ component }) {
  return (
    <React.Fragment key={`component-${component.id}`}>
      <div style={{ padding: 10, borderBottom: "1px dashed #ccc" }}>
        <DataSetting entity={component} type="input" label="Name" attr="settings.name" placeholder={component.id} />
        <SettingGroup>
          <label className="input">Title</label>
          <input
            type="text"
            value={component.getSetting("title", "")}
            onChange={event => {
              component.setSetting("title", event.target.value, Source.User);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Source</label>
          <input
            type="text"
            placeholder="http://path.to/youTube"
            value={component.getSetting("src", "")}
            onChange={event => {
              component.setSetting("src", event.target.value, Source.User);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Alt Text</label>
          <input
            type="text"
            value={component.getSetting("altText", "")}
            onChange={event => {
              component.setSetting("altText", event.target.value, Source.User);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label>Position</label>
          <select
            value={component.getSetting("position", "relative")}
            onChange={event => {
              component.setSetting("position", event.target.value, Source.User);
            }}
          >
            <option value="relative">Relative</option>
            <option value="absolute">Absolute</option>
            <option value="sticky">Sticky</option>
            <option value="fixed">Fixed</option>
          </select>
        </SettingGroup>
      </div>

      <Header>
        <h1>Style</h1>
      </Header>
      <div style={{ padding: 10 }}>
        <SettingGroup>
          <label className="input">Width</label>
          <input
            type="text"
            defaultValue={component.getStyle("maxWidth", "")}
            onBlur={event => {
              component.setStyle("maxWidth", event.target.value, Source.User);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Height</label>
          <input
            type="text"
            defaultValue={component.getStyle("height", "")}
            onBlur={event => {
              component.setStyle("height", event.target.value, Source.User);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Margin</label>
          <input
            type="text"
            defaultValue={component.getStyle("margin", "")}
            onBlur={event => {
              component.setStyle("margin", event.target.value, Source.User);
            }}
          />
        </SettingGroup>
      </div>
      <div style={{ borderTop: "1px dashed #ccc", padding: 10, textAlign: "center" }}>
        <button
          onClick={() => {
            component.remove(Source.User);
          }}
        >
          Delete YouTube
        </button>
      </div>
    </React.Fragment>
  );
};

import * as React from "react";

import { Section } from "Engine/Section";

import { Header, SettingGroup } from "../Styles";

export const ImageSettings: React.SFC<{
  section: Section;
  component: any;
}> = function ImageSettings({ section, component }) {
  return (
    <React.Fragment key={`component-${component.id}`}>
      <Header>
        <h1>Image Settings</h1>
      </Header>
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
        <SettingGroup>
          <label className="input">Source</label>
          <input
            type="text"
            placeholder="http://path.to/image"
            defaultValue={component.get("src", "")}
            onBlur={event => {
              component.set("src", event.target.value, true);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Alt Text</label>
          <input
            type="text"
            defaultValue={component.get("altText", "")}
            onBlur={event => {
              component.set("altText", event.target.value, true);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label>Position</label>
          <select
            value={component.getSetting("position")}
            onChange={event => {
              component.setSetting("position", event.target.value, true);
            }}
          >
            <option>None</option>
            <option value="background">Background</option>
            <option value="sticky">Sticky</option>
          </select>
        </SettingGroup>
      </div>

      <Header>
        <h1>Image Style</h1>
      </Header>
      <div style={{ padding: 10 }}>
        <SettingGroup>
          <label className="input">Width</label>
          <input
            type="text"
            defaultValue={component.getStyle("maxWidth", "")}
            onBlur={event => {
              component.setStyle("maxWidth", event.target.value, true);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Height</label>
          <input
            type="text"
            defaultValue={component.getStyle("height", "")}
            onBlur={event => {
              component.setStyle("height", event.target.value, true);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Margin</label>
          <input
            type="text"
            defaultValue={component.getStyle("margin", "")}
            onBlur={event => {
              component.setStyle("margin", event.target.value, true);
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
          Delete Image
        </button>
      </div>
    </React.Fragment>
  );
};

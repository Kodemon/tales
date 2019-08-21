import * as React from "react";

import { Source } from "Engine/Enums";
import { Section } from "Engine/Section";

import { Header, SettingGroup } from "../Styles";

export const ImageSettings: React.SFC<{
  section: Section;
  component: any;
}> = function ImageSettings({ section, component }) {
  return (
    <React.Fragment key={`component-${component.id}`}>
      <div style={{ padding: 10, borderBottom: "1px dashed #ccc" }}>
        <SettingGroup>
          <label className="input">Name</label>
          <input
            type="text"
            value={component.get("name", "")}
            onChange={event => {
              component.set("name", event.target.value, Source.User);
            }}
          />
        </SettingGroup>
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
            placeholder="http://path.to/image"
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
          Delete Image
        </button>
      </div>
    </React.Fragment>
  );
};

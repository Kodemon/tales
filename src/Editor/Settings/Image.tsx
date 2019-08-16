import * as React from "react";

import { Section } from "Engine/Section";
import { maybe } from "Engine/Utils";

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
      <div style={{ padding: 10 }}>
        <SettingGroup>
          <label className="input">Source</label>
          <input
            type="text"
            placeholder="http://path.to/image"
            value={component.src}
            onChange={event => {
              section.updateComponent({
                ...component,
                src: event.target.value
              });
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label>Position</label>
          <select
            value={maybe(component, "settings.position")}
            onChange={event => {
              section.updateComponentSettings(component, { position: event.target.value });
              // section.set("position", event.target.value);
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
            defaultValue={maybe(component, "style.width", "")}
            onBlur={event => {
              section.updateComponentStyle(component, { width: event.target.value });
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Height</label>
          <input
            type="text"
            defaultValue={maybe(component, "style.height", "")}
            onBlur={event => {
              section.updateComponentStyle(component, { height: event.target.value });
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Margin</label>
          <input
            type="text"
            defaultValue={maybe(component, "style.margin", "")}
            onBlur={event => {
              section.updateComponentStyle(component, { margin: event.target.value });
            }}
          />
        </SettingGroup>
      </div>
      <div style={{ borderTop: "1px solid #ccc", padding: 10, textAlign: "center" }}>
        <button
          onClick={() => {
            section.removeComponent(component);
          }}
        >
          Delete Image
        </button>
      </div>
    </React.Fragment>
  );
};

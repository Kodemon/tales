import * as React from "react";

import { Section } from "Engine/Section";
import { maybe } from "Engine/Utils";

import { Header, SettingGroup } from "../Styles";

export const TextSettings: React.SFC<{
  section: Section;
  component: any;
}> = function TextSettings({ section, component }) {
  return (
    <React.Fragment key={`component-${component.id}`}>
      <Header>
        <h1>Layout Settings</h1>
      </Header>
      <div style={{ padding: 10 }}>
        <SettingGroup>
          <label className="input">Min Width</label>
          <input
            type="number"
            defaultValue={maybe(component, "settings.min", "")}
            placeholder="280"
            onBlur={event => {
              section.updateComponentSettings(component, { min: event.target.value });
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Max Width</label>
          <input
            type="number"
            defaultValue={maybe(component, "settings.max", "")}
            placeholder="580"
            onBlur={event => {
              section.updateComponentSettings(component, { max: event.target.value });
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Layout</label>
          <select
            value={maybe<string>(component, "settings.layout", "middle")}
            onChange={event => {
              section.updateComponentSettings(component, { layout: event.target.value });
            }}
          >
            <option value="left">Left</option>
            <option value="middle">Middle</option>
            <option value="right">Right</option>
            <option value="center">Center</option>
          </select>
        </SettingGroup>
      </div>

      <Header>
        <h1>Text Settings</h1>
      </Header>
      <div style={{ padding: 10 }}>
        <SettingGroup>
          <label className="input">Color</label>
          <input
            type="text"
            defaultValue={maybe(component, "style.color", "")}
            placeholder="Base text color, eg. #fff"
            onBlur={event => {
              section.updateComponentStyle(component, { color: event.target.value });
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Font Size</label>
          <input
            type="text"
            defaultValue={maybe(component, "style.fontSize", "")}
            placeholder="Base text size, eg. 18px"
            onBlur={event => {
              section.updateComponentStyle(component, { fontSize: event.target.value });
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Color</label>
          <input
            type="text"
            defaultValue={maybe(component, "style.textShadow", "")}
            placeholder="Shadow settings, 1px 1px 2px #262626"
            onBlur={event => {
              section.updateComponentStyle(component, { textShadow: event.target.value });
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
          Delete Text
        </button>
      </div>
    </React.Fragment>
  );
};

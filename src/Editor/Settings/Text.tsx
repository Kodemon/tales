import * as React from "react";

import { Section } from "Engine/Section";

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
            defaultValue={component.getSetting("min", "")}
            placeholder="280"
            onBlur={event => {
              component.setSetting("min", event.target.value, true);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Max Width</label>
          <input
            type="number"
            defaultValue={component.getSetting("max", "")}
            placeholder="580"
            onBlur={event => {
              component.setSetting("max", event.target.value, true);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Layout</label>
          <select
            value={component.getSetting("layout", "middle")}
            onChange={event => {
              component.setSetting("layout", event.target.value, true);
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
            defaultValue={component.getStyle("color", "")}
            placeholder="Base text color, eg. #fff"
            onBlur={event => {
              component.setStyle("color", event.target.value, true);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Font Size</label>
          <input
            type="text"
            defaultValue={component.getStyle("fontSize", "")}
            placeholder="Base text size, eg. 18px"
            onBlur={event => {
              component.setStyle("fontSize", event.target.value, true);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Color</label>
          <input
            type="text"
            defaultValue={component.getStyle("textShadow", "")}
            placeholder="Shadow settings, 1px 1px 2px #262626"
            onBlur={event => {
              component.setStyle("textShadow", event.target.value, true);
            }}
          />
        </SettingGroup>
      </div>

      <div style={{ borderTop: "1px solid #ccc", padding: 10, textAlign: "center" }}>
        <button
          onClick={() => {
            section.removeComponent(component.id, true);
          }}
        >
          Delete Text
        </button>
      </div>
    </React.Fragment>
  );
};

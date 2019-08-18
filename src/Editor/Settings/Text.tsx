import * as React from "react";

import { Section } from "Engine/Section";

import { Toolbar } from "../Components/Toolbar";
import { Header, SettingGroup } from "../Styles";

export const TextSettings: React.SFC<{
  section: Section;
  component: any;
}> = function TextSettings({ section, component }) {
  return (
    <React.Fragment key={`component-${component.id}`}>
      <Header>
        <h1>Text Layout</h1>
      </Header>
      <div style={{ padding: 10, borderBottom: "1px dashed #ccc" }}>
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
        <h1>Base Text Styles</h1>
      </Header>
      <div style={{ padding: 10, borderBottom: "1px dashed #ccc" }}>
        <SettingGroup>
          <label className="input">Color</label>
          <input
            type="text"
            defaultValue={component.getStyle("color", "")}
            placeholder="#262626"
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
            placeholder="1em"
            onBlur={event => {
              component.setStyle("fontSize", event.target.value, true);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Padding</label>
          <input
            type="text"
            defaultValue={component.getStyle("padding", "")}
            placeholder="40px 20px"
            onBlur={event => {
              component.setStyle("padding", event.target.value, true);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Shadow</label>
          <input
            type="text"
            defaultValue={component.getStyle("textShadow", "")}
            placeholder="1px 1px 2px #262626"
            onBlur={event => {
              component.setStyle("textShadow", event.target.value, true);
            }}
          />
        </SettingGroup>
      </div>

      <Header>
        <h1>Text Formatting</h1>
      </Header>
      <div style={{ padding: 10 }}>
        <Toolbar quill={component.quill} />
      </div>

      <div style={{ borderTop: "1px dashed #ccc", padding: 10, textAlign: "center" }}>
        <button
          onClick={() => {
            component.remove(true);
          }}
        >
          Delete Text
        </button>
      </div>
    </React.Fragment>
  );
};

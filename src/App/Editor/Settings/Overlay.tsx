import * as React from "react";

import { Section } from "Engine/Section";

import { ColorPicker } from "../Lib/ColorPicker";
import { Header, SettingGroup } from "../Styles";

export const OverlaySettings: React.SFC<{
  section: Section;
  component: any;
}> = function OverlaySettings({ section, component }) {
  return (
    <React.Fragment key={`component-${component.id}`}>
      <div style={{ padding: 10, borderBottom: "1px dashed #ccc" }}>
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
        <ColorPicker label="Background Color" effected={component} />
        <SettingGroup>
          <label>Position</label>
          <select
            value={component.getSetting("type")}
            onChange={event => {
              component.setSetting("type", event.target.value, true);
            }}
          >
            <option>None</option>
            <option value="topToBottom">Top to Bottom</option>
            <option value="bottomToTop">Bottom to Top</option>
            <option value="leftToRight">Horizontal Left to Right</option>
            <option value="rightToLeft">Horizontal Right to Left</option>
            <option value="vignette">Vignette</option>
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

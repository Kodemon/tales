import * as React from "react";

import { Section } from "Engine/Section";

import { ColorPicker } from "../Components/ColorPicker";
import { Header, SettingGroup } from "../Styles";

export const OverlaySettings: React.SFC<{
  section: Section;
  component: any;
}> = function OverlaySettings({ section, component }) {
  return (
    <React.Fragment key={`component-${component.id}`}>
      <div style={{ padding: 10, borderBottom: "1px dashed #ccc" }}>
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
          <label className="input">Border Width</label>
          <input
            type="text"
            defaultValue={component.getSetting("borderWidth", "0")}
            onBlur={event => {
              component.setSetting("borderWidth", event.target.value, true);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Sticky</label>
          <input
            type="checkbox"
            value={component.getSetting("sticky", false)}
            onBlur={event => {
              component.setSetting("sticky", event.target.checked, true);
            }}
          />
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
      <div style={{ borderTop: "1px dashed #ccc", padding: 10, textAlign: "center" }}>
        <button
          onClick={() => {
            component.remove(true);
          }}
        >
          Remove Overlay
        </button>
      </div>
    </React.Fragment>
  );
};

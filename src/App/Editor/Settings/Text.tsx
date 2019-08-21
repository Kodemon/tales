import * as React from "react";

import { Section } from "Engine/Section";

import { Source } from "Engine/Enums";
import { Toolbar } from "../Components/Toolbar";
import { Header, SettingGroup } from "../Styles";

export const TextSettings: React.SFC<{
  section: Section;
  component: any;
}> = function TextSettings({ section, component }) {
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
        <Toolbar quill={component.quill} />
      </div>

      <Header>
        <h1>Settings</h1>
      </Header>
      <div style={{ padding: 10, borderBottom: "1px dashed #ccc" }}>
        <SettingGroup>
          <label className="input">Min Width</label>
          <input
            type="number"
            value={component.getSetting("min", "")}
            placeholder="280"
            onChange={event => {
              component.setSetting("min", event.target.value, Source.User);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Max Width</label>
          <input
            type="number"
            value={component.getSetting("max", "")}
            placeholder="780"
            onChange={event => {
              component.setSetting("max", event.target.value, Source.User);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Layout</label>
          <select
            value={component.getSetting("layout", "top,center")}
            onChange={event => {
              component.setSetting("layout", event.target.value, Source.User);
            }}
          >
            <option value="flex-start,flex-start">Top Left</option>
            <option value="flex-start,center">Top Center</option>
            <option value="flex-start,flex-end">Top Right</option>
            <option value="center,left">Center Left</option>
            <option value="center,center">Center Center</option>
            <option value="center,flex-end">Center Right</option>
            <option value="flex-end,flex-start">Bottom Left</option>
            <option value="flex-end,center">Bottom Center</option>
            <option value="flex-end,flex-end">Bottom Right</option>
          </select>
        </SettingGroup>
      </div>

      <Header>
        <h1>Styles</h1>
      </Header>
      <div style={{ padding: 10 }}>
        <SettingGroup>
          <label className="input">Font Size</label>
          <input
            type="text"
            defaultValue={component.getStyle("fontSize", "")}
            placeholder="1em"
            onBlur={event => {
              component.setStyle("fontSize", event.target.value, Source.User);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Color</label>
          <input
            type="text"
            defaultValue={component.getStyle("color", "")}
            placeholder="#262626"
            onBlur={event => {
              component.setStyle("color", event.target.value, Source.User);
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
              component.setStyle("textShadow", event.target.value, Source.User);
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
              component.setStyle("padding", event.target.value, Source.User);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Columns</label>
          <select
            value={component.getStyle("columns", "1")}
            onChange={event => {
              component.setStyle("columns", event.target.value, Source.User);
            }}
          >
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
            <option value="4">Four</option>
          </select>
        </SettingGroup>
        <SettingGroup>
          <label className="input">Column Gap</label>
          <input
            type="text"
            defaultValue={component.getStyle("columnGap", "")}
            placeholder="30px"
            onBlur={event => {
              component.setStyle("columnGap", event.target.value, Source.User);
            }}
          />
        </SettingGroup>
        <SettingGroup>
          <label className="input">Column Rule</label>
          <input
            type="text"
            defaultValue={component.getStyle("columnRule", "")}
            placeholder="2px outset #444"
            onBlur={event => {
              component.setStyle("columnRule", event.target.value, Source.User);
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
          Delete Text
        </button>
      </div>
    </React.Fragment>
  );
};

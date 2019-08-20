import * as React from "react";

import { Source } from "Engine/Enums";
import { Section } from "Engine/Section";

import { ColorPicker } from "../Components/ColorPicker";
import { SettingGroup } from "../Styles";

export const SectionSettings: React.SFC<{
  section: Section;
}> = function SectionSettings({ section }) {
  return (
    <div key={`section-${section.id}`} style={{ padding: 10 }}>
      <SettingGroup>
        <label className="input">Position</label>
        <select
          value={section.getSetting("position", "relative")}
          onChange={event => {
            section.setSetting("position", event.target.value, Source.User);
          }}
        >
          <option value="relative">Relative</option>
          <option value="sticky">Sticky</option>
          <option value="absolute">Absolute</option>
        </select>
      </SettingGroup>
      <SettingGroup>
        <label className="input">Height</label>
        <input
          type="number"
          value={`${Math.floor(section.getSetting("height", 1) * 100)}`}
          placeholder="100"
          onChange={event => {
            console.log(event.target.value, parseFloat(event.target.value) / 100);
            section.setSetting("height", parseFloat(event.target.value) / 100, Source.User);
          }}
        />
      </SettingGroup>
      <ColorPicker label="Background Color" effected={section} />
    </div>
  );
};

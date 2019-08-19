import * as React from "react";

import { Section } from "Engine/Section";

import { ColorPicker } from "../Lib/ColorPicker";
import { SettingGroup, SettingGroupStacked } from "../Styles";

export const SectionSettings: React.SFC<{
  section: Section;
}> = function SectionSettings({ section }) {
  return (
    <div key={`section-${section.id}`} style={{ padding: 10 }}>
      <SettingGroup>
        <label className="input">Position</label>
        <select
          value={section.data.settings.position}
          onChange={event => {
            section.setSetting("position", event.target.value, true);
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
          defaultValue={`${section.getSetting("height") * 100}`}
          onBlur={event => {
            section.setSetting("height", parseInt(event.target.value, 10) / 100, true);
          }}
        />
      </SettingGroup>
      <ColorPicker label="Background Color" effected={section} />
    </div>
  );
};

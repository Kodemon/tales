import * as React from "react";

import { Section } from "Engine/Section";

import { ColorPicker } from "./Components/ColorPicker";
import { DataSetting } from "./Components/DataSetting";

export const Sidebar: React.SFC<{
  section?: Section;
}> = function Sidebar({ section }) {
  if (!section) {
    return <div />;
  }
  return (
    <div>
      <div key={`section-${section.id}`} style={{ padding: 10 }}>
        <DataSetting entity={section} type="input" label="Name" attr="settings.name" placeholder={section.id} />
        <DataSetting
          entity={section}
          type="select"
          label="Position"
          attr="settings.position"
          options={[{ label: "Relative", value: "relative" }, { label: "Absolute", value: "absolute" }, { label: "Sticky", value: "sticky" }]}
        />
        <DataSetting
          entity={section}
          type="input"
          label="Height"
          attr="settings.height"
          fallback={1}
          placeholder="100"
          onValue={value => value * 100}
          onChange={value => (value === "" ? 0 : parseFloat(value) / 100)}
        />
        <ColorPicker label="Background Color" effected={section} />
      </div>
    </div>
  );
};

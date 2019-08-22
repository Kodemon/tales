import * as React from "react";

import { DataSetting } from "../Components/DataSetting";

export const TextSettings: React.SFC<{
  component: any;
}> = function TextSettings({ component }) {
  return (
    <React.Fragment key={`component-${component.id}`}>
      <DataSetting entity={component} type="input" label="Name" attr="settings.name" placeholder={component.id} />

      <h1>Settings</h1>
      <DataSetting
        entity={component}
        type="select"
        label="Layout"
        attr="settings.layout"
        fallback="top,center"
        options={[
          { value: "flex-start,flex-start", label: "Top Left" },
          { value: "flex-start,center", label: "Top Center" },
          { value: "flex-start,flex-end", label: "Top Right" },
          { value: "center,left", label: "Center Left" },
          { value: "center,center", label: "Center Center" },
          { value: "center,flex-end", label: "Center Right" },
          { value: "flex-end,flex-start", label: "Bottom Left" },
          { value: "flex-end,center", label: "Bottom Center" },
          { value: "flex-end,flex-end", label: "Bottom Right" }
        ]}
      />
      <DataSetting entity={component} type="input" label="Min Width" attr="settings.min" placeholder="280px" />
      <DataSetting entity={component} type="input" label="Max Width" attr="settings.max" placeholder="762px" />
      <DataSetting entity={component} type="input" label="Padding" attr="style.padding" placeholder="40px 20px" />

      <h1>Font</h1>
      <DataSetting entity={component} type="input" label="Size" attr="style.fontSize" placeholder="1em" />
      <DataSetting entity={component} type="input" label="Line Height" attr="style.lineHeight" placeholder="1.77" />
      <DataSetting entity={component} type="input" label="Color" attr="style.color" placeholder="#262626" />
      <DataSetting entity={component} type="input" label="Shadow" attr="style.textShadow" placeholder="1px 1px 2px #262626" />

      <h1>Columns</h1>
      <DataSetting
        entity={component}
        type="select"
        label="Columns"
        attr="style.columns"
        fallback="1"
        options={[{ label: "One", value: "1" }, { label: "Two", value: "2" }, { label: "Three", value: "3" }, { label: "Four", value: "4" }]}
      />
      <DataSetting entity={component} type="input" label="Column Gap" attr="style.columnGap" placeholder="30px" />
      <DataSetting entity={component} type="input" label="Column Rule" attr="style.columnRule" placeholder="2px outset #444" />
    </React.Fragment>
  );
};

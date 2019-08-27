import * as React from "react";
import * as ReactDOM from "react-dom";

import { Source } from "Engine/Enums";
import { ComponentDivider } from "../Components/ComponentDivider";
import { DataGroup, DataSetting } from "../Components/DataSetting";
import { Toolbar } from "../Components/Toolbar";
import { ActionButton, ActionGroup, SettingGroup } from "../Styles";

export const TextSettings: React.SFC<{
  component: any;
}> = function TextSettings({ component }) {
  return (
    <React.Fragment key={`component-${component.id}`}>
      <DataGroup>
        <DataSetting entity={component} type="input" label="Name" attr="settings.name" placeholder={component.id} />
        <SettingGroup>
          <label className="input">Actions</label>
          <ActionGroup>
            <ActionButton
              onClick={() => {
                component.remove(Source.User);
              }}
            >
              <i className="fa fa-magic" />
            </ActionButton>
            <ActionButton
              onClick={() => {
                component.remove(Source.User);
              }}
            >
              <i className="fa fa-copy" />
            </ActionButton>
            <ActionButton
              onClick={() => {
                component.remove(Source.User);
              }}
            >
              <i className="fa fa-trash" />
            </ActionButton>
          </ActionGroup>
        </SettingGroup>
      </DataGroup>

      {ReactDOM.createPortal(<Toolbar quill={component.quill} />, document.getElementById("toolbar") as Element)}

      <ComponentDivider label="Settings" icon="cogs" />
      <DataGroup>
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
        <DataSetting entity={component} type="input" label="Padding" attr="style.padding" placeholder="40px 20px" />
      </DataGroup>

      <ComponentDivider label="Text Width" icon="text-width" />
      <DataGroup>
        <DataSetting entity={component} type="input" label="Min" attr="settings.min" placeholder="280px" />
        <DataSetting entity={component} type="input" label="Max" attr="settings.max" placeholder="762px" />
      </DataGroup>

      <ComponentDivider label="Font" icon="font" />
      <DataGroup>
        <DataSetting entity={component} type="input" label="Size" attr="style.fontSize" placeholder="1em" />
        <DataSetting entity={component} type="input" label="Line Height" attr="style.lineHeight" placeholder="1.77" />
      </DataGroup>
      <DataGroup>
        <DataSetting entity={component} type="input" label="Color" attr="style.color" placeholder="#262626" />
        <DataSetting entity={component} type="input" label="Shadow" attr="style.textShadow" placeholder="1px 1px 2px #262626" />
      </DataGroup>

      <ComponentDivider label="Columns" icon="columns" />
      <DataSetting entity={component} type="slider" label="Columns" attr="style.columns" fallback="1" options={{ min: 1, max: 4 }} />
      <DataGroup>
        <DataSetting entity={component} type="input" label="Gap" attr="style.columnGap" placeholder="30px" />
        <DataSetting entity={component} type="input" label="Rule" attr="style.columnRule" placeholder="2px outset #444" />
      </DataGroup>
    </React.Fragment>
  );
};

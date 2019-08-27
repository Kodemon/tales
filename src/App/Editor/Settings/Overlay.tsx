import * as React from "react";

import { Source } from "Engine/Enums";
import { ColorPicker } from "../Components/ColorPicker";
import { ComponentDivider } from "../Components/ComponentDivider";
import { DataGroup, DataSetting } from "../Components/DataSetting";
import { ActionButton, ActionGroup, SettingGroup } from "../Styles";

export const OverlaySettings: React.SFC<{
  component: any;
  edit: (section?: string, stack?: string, component?: string) => void;
}> = function OverlaySettings({ component, edit }) {
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
                edit(component.section.id, component.stack.id);
              }}
            >
              <i className="fa fa-magic" />
            </ActionButton>
            <ActionButton
              onClick={() => {
                component.remove(Source.User);
                edit(component.section.id, component.stack.id);
              }}
            >
              <i className="fa fa-copy" />
            </ActionButton>
            <ActionButton
              onClick={() => {
                component.remove(Source.User);
                edit(component.section.id, component.stack.id);
              }}
            >
              <i className="fa fa-trash" />
            </ActionButton>
          </ActionGroup>
        </SettingGroup>
      </DataGroup>
      <ComponentDivider label="Settings" icon="cogs" />
      <DataSetting
        entity={component}
        type="select"
        label="Position"
        attr="settings.type"
        options={[
          { label: "Solid", value: "solid" },
          { label: "Top to Bottom", value: "topToBottom" },
          { label: "Bottom to Top", value: "bottomToTop" },
          { label: "Horizontal Left to Right", value: "leftToRight" },
          { label: "Horizontal Right to Left", value: "rightToLeft" },
          { label: "Vignette", value: "vignette" }
        ]}
      />
      <DataSetting entity={component} type="checkbox" label="Sticky" attr="settings.sticky" />
      <h1>Style</h1>
      <DataSetting entity={component} type="input" label="Height" attr="style.height" />
      <DataSetting entity={component} type="input" label="Border Width" attr="style.borderWidth" fallback={0} />
      <ColorPicker label="Background Color" effected={component} />
    </React.Fragment>
  );
};

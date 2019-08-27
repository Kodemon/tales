import * as React from "react";

import { Source } from "Engine/Enums";

import { ComponentDivider } from "../Components/ComponentDivider";
import { DataGroup, DataSetting } from "../Components/DataSetting";
import { ActionButton, ActionGroup, SettingGroup } from "../Styles";

export const ImageSettings: React.SFC<{
  component: any;
}> = function ImageSettings({ component }) {
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

      <ComponentDivider label="Settings" icon="cogs" />
      <DataGroup>
        <DataSetting entity={component} type="input" label="Title" attr="settings.title" />
        <DataSetting entity={component} type="input" label="Alt" attr="settings.altText" />
      </DataGroup>
      <DataSetting
        entity={component}
        type="input"
        label="Src"
        attr="settings.src"
        placeholder="//path.to/image"
        onDrop={event => {
          event.preventDefault();
          component.setSetting("src", event.dataTransfer.getData("Text"), Source.User);
        }}
      />

      <ComponentDivider label="Position" />
      <DataSetting
        entity={component}
        type="select"
        label="Position"
        attr="settings.position"
        options={[{ label: "Relative", value: "relative" }, { label: "Absolute", value: "absolute" }, { label: "Sticky", value: "sticky" }, { label: "Fixed", value: "fixed" }]}
      />
      {component.getSetting("position") === "absolute" && <DataSetting entity={component} type="position" attr="style.objectPosition" />}

      <ComponentDivider label="Spacing" />
      <DataGroup>
        <DataSetting entity={component} type="input" label="Margin" attr="style.margin" placeholder="Auto" />
        <DataSetting entity={component} type="input" label="Padding" attr="style.padding" placeholder="Auto" />
      </DataGroup>

      <ComponentDivider label="Size" />
      <DataGroup>
        <DataSetting entity={component} type="input" label="Width" attr="style.width" placeholder="Auto" />
        <DataSetting entity={component} type="input" label="Height" attr="style.height" placeholder="Auto" />
      </DataGroup>
      <DataGroup>
        <DataSetting entity={component} type="input" label="Min W" attr="style.minWidth" placeholder="Auto" />
        <DataSetting entity={component} type="input" label="Min H" attr="style.minHeight" placeholder="Auto" />
      </DataGroup>
    </React.Fragment>
  );
};

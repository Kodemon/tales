import * as React from "react";

import { Source } from "Engine/Enums";
import { ComponentDivider } from "../Components/ComponentDivider";
import { DataGroup, DataSetting } from "../Components/DataSetting";
import { ActionButton, ActionGroup, SettingGroup } from "../Styles";

export const ImageSettings: React.SFC<{
  component: any;
  edit: (section?: string, stack?: string, component?: string) => void;
}> = function ImageSettings({ component, edit }) {
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
      <ComponentDivider label="Style" icon="paint-brush" />
      <DataGroup>
        <DataSetting entity={component} type="input" label="Margin" attr="style.margin" placeholder="0px" />
        <DataSetting
          entity={component}
          type="select"
          label="Position"
          attr="settings.position"
          options={[{ label: "Relative", value: "relative" }, { label: "Absolute", value: "absolute" }, { label: "Sticky", value: "sticky" }, { label: "Fixed", value: "fixed" }]}
        />
      </DataGroup>
      <DataGroup>
        <DataSetting entity={component} type="input" label="Width" attr="style.maxWidth" />
        <DataSetting entity={component} type="input" label="Height" attr="style.height" />
      </DataGroup>
    </React.Fragment>
  );
};

import * as React from "react";

import { ComponentDivider } from "../Components/ComponentDivider";
import { DataSetting } from "../Components/DataSetting";

export const ImageSettings: React.SFC<{
  component: any;
}> = function ImageSettings({ component }) {
  return (
    <React.Fragment key={`component-${component.id}`}>
      <DataSetting entity={component} type="input" label="Name" attr="settings.name" placeholder={component.id} />
      <DataSetting
        entity={component}
        type="select"
        label="Position"
        attr="settings.position"
        options={[{ label: "Relative", value: "relative" }, { label: "Absolute", value: "absolute" }, { label: "Sticky", value: "sticky" }, { label: "Fixed", value: "fixed" }]}
      />

      <ComponentDivider label="Settings" icon="cogs" />
      <DataSetting entity={component} type="input" label="Title" attr="settings.title" />
      <DataSetting entity={component} type="input" label="Src" attr="settings.src" placeholder="//path.to/image" />
      <DataSetting entity={component} type="input" label="Alt" attr="settings.altText" />

      <ComponentDivider label="Style" icon="paint-brush" />
      <DataSetting entity={component} type="input" label="Width" attr="style.maxWidth" />
      <DataSetting entity={component} type="input" label="Height" attr="style.height" />
      <DataSetting entity={component} type="input" label="Margin" attr="style.margin" />
    </React.Fragment>
  );
};

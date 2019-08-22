import * as React from "react";

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

      <h1>Image</h1>
      <DataSetting entity={component} type="input" label="Title" attr="settings.title" />
      <DataSetting entity={component} type="input" label="Src" attr="settings.src" placeholder="//path.to/image" />
      <DataSetting entity={component} type="input" label="Alt" attr="settings.altText" />

      <h1>Style</h1>
      <DataSetting entity={component} type="input" label="Width" attr="style.maxWidth" />
      <DataSetting entity={component} type="input" label="Height" attr="style.height" />
      <DataSetting entity={component} type="input" label="Margin" attr="style.margin" />
    </React.Fragment>
  );
};

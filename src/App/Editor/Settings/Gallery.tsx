import * as React from "react";

import { DataSetting } from "../Components/DataSetting";

export const GallerySettings: React.SFC<{
  component: any;
}> = function GallerySettings({ component }) {
  return (
    <React.Fragment key={`component-${component.id}`}>
      <DataSetting entity={component} type="input" label="Title" attr="settings.title" placeholder={component.id} />
    </React.Fragment>
  );
};

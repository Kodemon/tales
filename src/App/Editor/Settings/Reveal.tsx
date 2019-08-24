import * as React from "react";

import { DataSetting } from "../Components/DataSetting";

export const RevealSettings: React.SFC<{
  component: any;
}> = function ImageSettings({ component }) {
  return (
    <React.Fragment key={`component-${component.id}`}>
      <DataSetting entity={component} type="input" label="Name" attr="settings.name" placeholder={component.id} />
    </React.Fragment>
  );
};

import * as React from "react";

import { Divider } from "../Styles";

export const ComponentDivider: React.SFC<{
  label: string;
  icon?: string;
}> = function ComponentDivider({ label, icon = "asterisk" }) {
  return (
    <React.Fragment>
      <div style={{ marginTop: 15 }}>
        <i className={`fa fa-${icon}`} style={{ marginRight: 3 }} /> {label}
      </div>
      <Divider />
    </React.Fragment>
  );
};

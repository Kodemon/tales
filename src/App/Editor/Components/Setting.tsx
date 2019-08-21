import { Source } from "Engine/Enums";
import * as React from "react";
import { SettingGroup } from "../Styles";

export class InputSetting extends React.Component<{
  type: "set" | "setting" | "style";
  key: string;
  entity: any;
}> {
  private current: any;

  public shouldComponentUpdate() {
    const { type, key, entity } = this.props;
    switch (type) {
      case "set": {
        const value = entity.get(key);
        if (value !== this.current) {
          return true;
        }
        break;
      }
      case "setting": {
        const value = entity.getSetting(key);
        if (value !== this.current) {
          return true;
        }
        break;
      }
      case "style": {
        const value = entity.getStyle(key);
        if (value !== this.current) {
          return true;
        }
        break;
      }
    }
    return false;
  }

  private onUpdate = () => {
    // ...
  };

  public render() {
    const { type, key, entity } = this.props;
    return (
      <SettingGroup>
        <label className="input">Height</label>
        <input
          type="text"
          defaultValue={entity.getStyle("height", "")}
          onBlur={event => {
            entity.setStyle("height", event.target.value, Source.User);
          }}
        />
      </SettingGroup>
    );
  }
}

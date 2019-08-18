import * as React from "react";
import { SketchPicker } from "react-color";

import { Section } from "Engine/Section";

import { SettingGroup, SettingGroupStacked } from "../Styles";

export const SectionSettings: React.SFC<{
  section: Section;
}> = function SectionSettings({ section }) {
  return (
    <div key={`section-${section.id}`} style={{ padding: 10 }}>
      <SettingGroup>
        <label className="input">Position</label>
        <select
          value={section.data.settings.position}
          onChange={event => {
            section.setSetting("position", event.target.value, true);
          }}
        >
          <option value="relative">Relative</option>
          <option value="sticky">Sticky</option>
          <option value="absolute">Absolute</option>
        </select>
      </SettingGroup>
      <SettingGroup>
        <label className="input">Height</label>
        <input
          type="number"
          defaultValue={`${section.getSetting("height") * 100}`}
          onBlur={event => {
            section.setSetting("height", parseInt(event.target.value, 10) / 100, true);
          }}
        />
      </SettingGroup>
      <ColorPicker label="Background Color" section={section} />
    </div>
  );
};

class ColorPicker extends React.Component<
  {
    label: string;
    section: Section;
  },
  {
    show: boolean;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      show: true
    };
  }

  public render() {
    return (
      <SettingGroupStacked>
        <label
          style={{ cursor: "pointer" }}
          className="input"
          onClick={() => {
            this.setState(() => ({ show: !this.state.show }));
          }}
        >
          {this.props.label}
          <i className={`fa fa-caret-${this.state.show ? "up" : "down"}`} style={{ float: "right", marginTop: 4 }} />
        </label>
        {this.state.show && (
          <SketchPicker
            width={240}
            style={{ boxShadow: "none", background: "none" }}
            color={this.props.section.getSetting("background")}
            onChangeComplete={(color: any) => {
              this.props.section.setSetting("background", color.hex, true);
            }}
          />
        )}
      </SettingGroupStacked>
    );
  }
}

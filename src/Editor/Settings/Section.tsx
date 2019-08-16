import * as React from "react";
import { SketchPicker } from "react-color";

import { Section } from "Engine/Section";

import { Header, SettingGroup, SettingGroupStacked } from "../Styles";

export const SectionSettings: React.SFC<{
  section: Section;
}> = function SectionSettings({ section }) {
  return (
    <React.Fragment key={`section-${section.id}`}>
      <Header>
        <h1>Section Settings</h1>
      </Header>
      <div style={{ borderBottom: "1px solid #ccc", padding: 10 }}>
        <SettingGroup>
          <label className="input">Position</label>
          <select
            value={section.data.settings.position}
            onChange={event => {
              section.set("position", event.target.value);
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
            defaultValue={`${section.get("height") * 100}`}
            onChange={event => {
              section.set("height", parseInt(event.target.value, 10) / 100);
            }}
          />
        </SettingGroup>
        <ColorPicker label="Background Color" section={section} />
      </div>
    </React.Fragment>
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
      show: false
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
          <i className={`fa fa-caret-${this.state.show ? "down" : "up"}`} style={{ float: "right", marginTop: 4 }} />
        </label>
        {this.state.show && (
          <SketchPicker
            width={240}
            color={this.props.section.get("background")}
            onChangeComplete={(color: any) => {
              this.props.section.set("background", color.hex);
            }}
          />
        )}
      </SettingGroupStacked>
    );
  }
}

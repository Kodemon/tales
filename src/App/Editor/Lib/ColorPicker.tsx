import * as React from "react";
import { SketchPicker } from "react-color";

import { Component } from "Engine/Components/Component";
import { Section } from "Engine/Section";

import { SettingGroupStacked } from "../Styles";

export class ColorPicker extends React.Component<
  {
    label: string;
    effected: Section | Component;
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
            color={this.props.effected.getSetting("background")}
            onChangeComplete={(color: any) => {
              this.props.effected.setSetting("background", `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`, true);
            }}
          />
        )}
      </SettingGroupStacked>
    );
  }
}

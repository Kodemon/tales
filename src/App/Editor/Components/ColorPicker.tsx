import * as React from "react";
import { SketchPicker } from "react-color";

import { Component } from "Engine/Component";
import { Source } from "Engine/Enums";
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
          <i className={`fa fa-caret-${this.state.show ? "up" : "down"}`} style={{ float: "right", marginTop: 4 }} />
        </label>
        {this.state.show && (
          <SketchPicker
            width={null}
            style={{ boxShadow: "none", background: "none" }}
            color={this.props.effected.getStyle("background")}
            onChangeComplete={(color: any) => {
              this.props.effected.setStyle("background", `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`, Source.User);
            }}
          />
        )}
      </SettingGroupStacked>
    );
  }
}

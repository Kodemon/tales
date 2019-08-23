import * as React from "react";
import { SketchPicker } from "react-color";
import styled from "styled-components";

import { Component } from "Engine/Component";
import { Source } from "Engine/Enums";
import { Section } from "Engine/Section";

import { Color, Font } from "../../Variables";
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
        <div className="header">
          <i className={`fa fa-caret-${this.state.show ? "down" : "right"}`} />
          <label
            style={{ cursor: "pointer" }}
            className="input"
            onClick={() => {
              this.setState(() => ({ show: !this.state.show }));
            }}
          >
            {this.props.label}
          </label>
        </div>
        <Content className="content">
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
        </Content>
      </SettingGroupStacked>
    );
  }
}

const Content = styled.div`
  span {
    color: ${Color.Font} !important;
  }

  .sketch-picker {
    background: none !important;
    box-shadow: none !important;
  }

  .flexbox-fix {
    border-top: 1px solid ${Color.BorderLight} !important;
  }

  input {
    background: ${Color.BackgroundDark};
    border: 1px solid ${Color.Border};
    color: ${Color.Font};
    font-size: ${Font.Size};
    padding: 4px;

    box-shadow: none !important;
    width: 100% !important;

    &:focus {
      outline: 1px solid ${Color.BackgroundBlue};
    }
  }
`;

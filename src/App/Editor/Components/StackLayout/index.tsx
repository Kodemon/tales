import * as React from "react";

import { Stack } from "Engine/Stack";

import { SettingGroupStacked } from "../../Styles";

import { GridPreview } from "./GridPreview";
import { grid, template } from "./Parser";
import { integer } from "./Parser/Types";
import { Preview } from "./Preview";
import { Text } from "./Text";

import {
  Container,
  Hint,
  MainInner,
  SettingDivider,
  SettingInput,
  Settings,
  StyledMain,
  StyledSidebar,
  StyledTemplate,
  StyledTemplateControl,
  StyledTemplateTitle,
  TemplateInput
} from "./Styles";

export class StackLayout extends React.Component<
  {
    stack: Stack;
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

  public setTracks = (evt: any) => {
    this.props.stack.setSetting("grid", grid(evt.target.value));
  };

  public setWidth = (evt: any) => {
    const grid = this.props.stack.getSetting("grid");
    this.props.stack.setSetting("grid", {
      ...grid,
      width: integer(evt.target.value, grid.width, 1, 100)
    });
  };

  public setHeight = (evt: any) => {
    const grid = this.props.stack.getSetting("grid");
    this.props.stack.setSetting("grid", {
      ...grid,
      height: integer(evt.target.value, grid.height, 1, 100)
    });
  };

  public setArea = (key: string, value: any) => {
    const grid = this.props.stack.getSetting("grid");
    this.props.stack.setSetting("grid", {
      ...grid,
      areas: {
        ...grid.areas,
        [key]: value
      }
    });
  };

  public renderSetting() {
    const grid = this.props.stack.getSetting("grid");
    if (!grid || !grid.width) {
      return (
        <Container>
          <Hint>Add a Component to get started.</Hint>
        </Container>
      );
    }

    const { width, height, areas } = grid;
    const tpl = template(grid);

    return (
      <Container>
        <StyledSidebar>
          <Hint>Edit the template string below or drag the areas in the preview.</Hint>
          <StyledTemplate>
            <StyledTemplateTitle>Template areas</StyledTemplateTitle>
            <StyledTemplateControl>
              <Text value={tpl} onBlur={this.setTracks}>
                {(props: any) => <TemplateInput {...props} />}
              </Text>
            </StyledTemplateControl>
          </StyledTemplate>
        </StyledSidebar>
        <StyledMain>
          <Settings>
            <Text value={width} onBlur={this.setWidth}>
              {(props: any) => <SettingInput {...props} />}
            </Text>
            <SettingDivider>x</SettingDivider>
            <Text value={height} onBlur={this.setHeight}>
              {(props: any) => <SettingInput {...props} />}
            </Text>
          </Settings>
          <MainInner>
            <GridPreview width={width} height={height} areas={areas} components={this.props.stack.components} />
            <Preview tpl={tpl} width={width} height={height} areas={areas} setArea={this.setArea} components={this.props.stack.components} />
          </MainInner>
        </StyledMain>
      </Container>
    );
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
            Grid Layout
          </label>
        </div>
        <div className="content">{this.state.show && this.renderSetting()}</div>
      </SettingGroupStacked>
    );
  }
}

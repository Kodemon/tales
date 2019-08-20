import * as React from "react";

import { Component } from "Engine/Component";
import { Source } from "Engine/Enums";
import { Stack } from "Engine/Stack";

import { SettingGroupStacked } from "../../Styles";

import { GridPreview } from "./GridPreview";
import { grid, template } from "./Parser";
import { clamp, Grid, integer } from "./Parser/Types";
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
    grid: Grid;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      show: true,
      grid: {
        width: 2,
        height: 1,
        areas: {
          text: {
            column: { start: 1, end: 2, span: 1 },
            row: { start: 1, end: 2, span: 1 }
          },
          image: {
            column: { start: 2, end: 3, span: 1 },
            row: { start: 1, end: 2, span: 1 }
          }
        }
      }
    };
  }

  // <select
  // value={section.getSetting("position", "relative")}
  // onChange={event => {
  //   section.setSetting("position", event.target.value, Source.User);
  // }}

  public setTracks = (evt: any) => {
    this.setState(() => ({ grid: grid(evt.target.value) }));
  };

  public setWidth = (evt: any) => {
    this.setState(({ grid }) => ({
      grid: {
        ...grid,
        width: integer(evt.target.value, grid.width, 1, 100)
      }
    }));
  };

  public setHeight = (evt: any) => {
    this.setState(({ grid }) => ({
      grid: {
        ...grid,
        height: integer(evt.target.value, grid.height, 1, 100)
      }
    }));
  };

  public setArea = (key: string, value: any) => {
    this.setState(({ grid }) => ({
      grid: {
        ...grid,
        areas: {
          ...grid.areas,
          [key]: value
        }
      }
    }));
  };

  public save = () => {
    console.log(this.state.grid);
    console.log(template(this.state.grid));
    this.props.stack.setStyle("display", "grid", Source.User);
    this.props.stack.setStyle("gridTemplateColumns", "1fr ".repeat(this.state.grid.width).trim(), Source.User);
    this.props.stack.setStyle("gridTemplateRows", "1fr ".repeat(this.state.grid.height).trim(), Source.User);
    this.props.stack.setStyle("gridTemplateAreas", template(this.state.grid), Source.User);
  };

  public renderSetting() {
    const { grid } = this.state;
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
            <GridPreview width={width} height={height} areas={areas} />
            <Preview tpl={tpl} width={width} height={height} areas={areas} setArea={this.setArea} />
          </MainInner>
          <button onClick={this.save}>Apply</button>
        </StyledMain>
      </Container>
    );
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
          Stack Grid Layout
          <i className={`fa fa-caret-${this.state.show ? "up" : "down"}`} style={{ float: "right", marginTop: 4 }} />
        </label>
        {this.state.show && this.renderSetting()}
      </SettingGroupStacked>
    );
  }
}

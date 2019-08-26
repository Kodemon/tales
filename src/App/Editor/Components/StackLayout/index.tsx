import * as React from "react";

import { Stack } from "Engine/Stack";

import { SettingGroupStacked } from "../../Styles";

import { GridPreview } from "./GridPreview";
import { grid, template } from "./Parser";
import { maxColumnEnd, maxColumnStart, maxRowEnd, maxRowStart, minColumnEnd, minColumnStart, minRowEnd, minRowStart } from "./Parser/Bounds";
import { integer } from "./Parser/Types";
import { Preview } from "./Preview";
import { ActionButton, ActionGroup, Main, MainButtonGroup, MainCellButton, MainRow } from "./Styles";
import { Text } from "./Text";

import { Container, Hint, MainInner, SettingDivider, SettingInput, Settings, StyledSidebar, StyledTemplate, StyledTemplateControl, StyledTemplateTitle, TemplateInput } from "./Styles";

export class StackLayout extends React.Component<
  {
    stack: Stack;
    editing: {
      section: string;
      stack: string;
      component: string;
    };
    edit: (section?: string, stack?: string, component?: string) => void;
    toggleComponents: (stack?: Stack) => void;
  },
  {
    manualCss: boolean;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      manualCss: false
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

  public addWidth = (evt: any) => {
    const grid = this.props.stack.getSetting("grid");
    this.props.stack.setSetting("grid", {
      ...grid,
      width: integer(grid.width + 1, grid.width, 1, 100)
    });
    this.props.toggleComponents(this.props.stack);
  };

  public addHeight = (evt: any) => {
    const grid = this.props.stack.getSetting("grid");
    this.props.stack.setSetting("grid", {
      ...grid,
      height: integer(grid.height + 1, grid.height, 1, 100)
    });
    this.props.toggleComponents(this.props.stack);
  };

  public setWidthAndHeight = (width: number, height: number) => {
    const grid = this.props.stack.getSetting("grid");
    this.props.stack.setSetting("grid", {
      ...grid,
      width: integer(width, grid.width, 1, 100),
      height: integer(height, grid.height, 1, 100)
    });
  };

  public autoFit = () => {
    const grid = this.props.stack.getSetting("grid");
    this.props.stack.setSetting("grid", {
      ...grid,
      width: integer(maxColumnEnd(grid) - 1, grid.width, 1, 100),
      height: integer(maxRowEnd(grid) - 1, grid.height, 1, 100)
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

  public render() {
    const { manualCss } = this.state;
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
        {manualCss && (
          <StyledSidebar>
            <StyledTemplate>
              <StyledTemplateControl>
                <Text value={tpl} onBlur={this.setTracks}>
                  {(props: any) => <TemplateInput {...props} />}
                </Text>
              </StyledTemplateControl>
            </StyledTemplate>
            <Settings>
              <Text value={width} onBlur={this.setWidth}>
                {(props: any) => <SettingInput {...props} />}
              </Text>
              <SettingDivider>x</SettingDivider>
              <Text value={height} onBlur={this.setHeight}>
                {(props: any) => <SettingInput {...props} />}
              </Text>
            </Settings>
          </StyledSidebar>
        )}
        <Main>
          <MainRow>
            <MainButtonGroup>
              <ActionButton
                onClick={() => {
                  this.setWidthAndHeight(1, 1);
                }}
              >
                1x1
              </ActionButton>
              <ActionButton
                onClick={() => {
                  this.setWidthAndHeight(3, 3);
                }}
              >
                3x3
              </ActionButton>
              <ActionButton
                onClick={() => {
                  this.setWidthAndHeight(12, 1);
                }}
              >
                12x1
              </ActionButton>
              <ActionButton
                onClick={() => {
                  this.autoFit();
                }}
              >
                <i className="fa fa-compress"></i>
              </ActionButton>
              <ActionButton>
                <i className="fa fa-map"></i>
              </ActionButton>
            </MainButtonGroup>
            <MainInner>
              <GridPreview width={width} height={height} areas={areas} components={this.props.stack.components} />
              <Preview
                tpl={tpl}
                width={width}
                height={height}
                areas={areas}
                setArea={this.setArea}
                components={this.props.stack.components}
                editing={this.props.editing.component}
                edit={this.props.edit}
              />
            </MainInner>
            <MainCellButton className="right" onClick={this.addWidth}>
              <i className="fa fa-plus"></i>
            </MainCellButton>
          </MainRow>
          <MainRow>
            <MainCellButton className="bottom" onClick={this.addHeight}>
              <i className="fa fa-plus"></i>
            </MainCellButton>
          </MainRow>
        </Main>
      </Container>
    );
  }
}

// <GridPreview width={width} height={height} areas={areas} components={this.props.stack.components} />;

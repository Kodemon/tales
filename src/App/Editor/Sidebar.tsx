import * as React from "react";
import styled from "styled-components";

import { Component } from "Engine/Component";
import { Source } from "Engine/Enums";
import { Page } from "Engine/Page";
import { Section } from "Engine/Section";
import { Stack } from "Engine/Stack";

import { Color, Font } from "../Variables";
import { ColorPicker } from "./Components/ColorPicker";
import { Components } from "./Components/Components";
import { DataGroup, DataSetting } from "./Components/DataSetting";
import { StackLayout } from "./Components/StackLayout";
import { getCaretPosition, getComponentIcon } from "./Lib/Utils";
import { GallerySettings } from "./Settings/Gallery";
import { ImageSettings } from "./Settings/Image";
import { OverlaySettings } from "./Settings/Overlay";
import { RevealSettings } from "./Settings/Reveal";
import { TextSettings } from "./Settings/Text";
import { VimeoSettings } from "./Settings/Vimeo";
import { YouTubeSettings } from "./Settings/YouTube";
import { Categories, Category, CategoryContent, CategoryHeader, Divider } from "./Styles";

export class Sidebar extends React.Component<
  {
    page?: Page;
    editing: {
      section: string;
      stack: string;
      component: string;
    };
    edit: (section?: string, stack?: string, component?: string) => void;
  },
  {
    showComponents: boolean;
    stack?: Stack;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      showComponents: false
    };
  }

  private toggleComponents = (stack?: Stack) => {
    this.setState(() => ({ showComponents: !this.state.showComponents, stack }));
  };

  private editStack = (stack: Stack) => {
    if (this.props.editing.stack === stack.id) {
      this.props.edit(stack.section.id);
    } else {
      this.props.edit(stack.section.id, stack.id);
    }
  };

  private editComponent = (component: Component) => {
    if (this.props.editing.component === component.id) {
      this.props.edit(component.section.id, component.stack.id);
    } else {
      this.props.edit(component.section.id, component.stack.id, component.id);
    }
  };

  public render() {
    const section = this.props.page && this.props.editing.section && this.props.page.getSection(this.props.editing.section);
    if (!section) {
      return (
        <Container style={{ gridArea: "sidebar" }}>
          <NoSection>
            <div>Select a section to start editing</div>
          </NoSection>
        </Container>
      );
    }
    return (
      <Container key={`section-${section.id}`} style={{ gridArea: "sidebar" }}>
        {this.state.showComponents && <Components section={section} stack={this.state.stack} edit={this.props.edit} close={this.toggleComponents} />}
        <Categories>
          <Category>
            <CategoryContent>
              <i className="fa fa-television" /> Section - {section.getSetting("name", section.id)}
              <Divider />
              <DataSetting entity={section} type="input" label="Name" attr="settings.name" placeholder="Enter a section name" />
              <DataGroup>
                <DataSetting
                  entity={section}
                  type="input"
                  label="Height"
                  attr="settings.height"
                  fallback={1}
                  placeholder="100"
                  onValue={value => Math.floor(value * 100)}
                  onChange={value => (value === "" ? 0 : parseFloat(value) / 100)}
                />
                <DataSetting
                  entity={section}
                  type="select"
                  label="Position"
                  attr="settings.position"
                  options={[{ label: "Relative", value: "relative" }, { label: "Absolute", value: "absolute" }, { label: "Sticky", value: "sticky" }]}
                />
              </DataGroup>
              <ColorPicker label="Background Color" effected={section} />
            </CategoryContent>
          </Category>
          <Category>
            <CategoryHeader>
              <div className="caret">
                <i className="fa fa-database" style={{ fontSize: 10 }} />
              </div>
              <div className="header">Stacks</div>
              <div className="actions">
                <i className="fa fa-plus" onClick={() => this.toggleComponents()} />
              </div>
            </CategoryHeader>
          </Category>
          {this.renderStacks(section)}
          <div style={{ padding: 20, textAlign: "center" }}>
            <button
              onClick={() => {
                console.log(JSON.stringify(section.toJSON(), null, 2));
              }}
            >
              Save as template
            </button>
          </div>
        </Categories>
      </Container>
    );
  }

  private renderStacks(section: Section) {
    return section.stacks.map(stack => {
      return (
        <React.Fragment key={stack.id}>
          <Category>
            <CategoryHeader className={this.props.editing.stack === stack.id ? "blue" : ""}>
              <div
                className="caret"
                onClick={() => {
                  this.editStack(stack);
                }}
              >
                {getCaretPosition(this.props.editing.stack === stack.id)}
              </div>
              <div
                className="header"
                onClick={() => {
                  this.editStack(stack);
                }}
              >
                {stack.getSetting("name", stack.id)} Stack
              </div>
              <div className="actions">
                <i
                  className="fa fa-trash"
                  onClick={() => {
                    stack.remove(Source.User);
                    this.props.edit(section.id);
                  }}
                />
                <i className="fa fa-bars grab" onClick={() => window.alert("not yet")} />
              </div>
            </CategoryHeader>
            {this.props.editing.stack === stack.id && (
              <CategoryContent>
                <DataGroup>
                  <DataSetting entity={stack} type="input" label="Name" attr="settings.name" placeholder="Enter a stack name" />
                  <DataSetting
                    entity={stack}
                    type="select"
                    label="Position"
                    attr="settings.position"
                    options={[{ label: "Relative", value: "relative" }, { label: "Absolute", value: "absolute" }, { label: "Sticky", value: "sticky" }]}
                  />
                </DataGroup>
                <StackLayout stack={stack} editing={this.props.editing} edit={this.props.edit} toggleComponents={this.toggleComponents} />
              </CategoryContent>
            )}
          </Category>
          {this.props.editing.stack === stack.id && this.renderComponents(stack)}
        </React.Fragment>
      );
    });
  }

  private renderComponents(stack: Stack) {
    return stack.components.map(component => {
      return <Category key={component.id}>{this.props.editing.component === component.id && <CategoryContent>{this.renderComponent(component)}</CategoryContent>}</Category>;
    });
  }

  private renderComponent(component: Component) {
    switch (component.type) {
      case "image": {
        return (
          <ComponentSettings key={`settings-${component.id}`}>
            <ImageSettings component={component} edit={this.props.edit} />
          </ComponentSettings>
        );
      }
      case "youTube": {
        return (
          <ComponentSettings>
            <YouTubeSettings component={component} />
          </ComponentSettings>
        );
      }
      case "vimeo": {
        return (
          <ComponentSettings>
            <VimeoSettings component={component} />
          </ComponentSettings>
        );
      }
      case "text": {
        return (
          <ComponentSettings>
            <TextSettings component={component} />
          </ComponentSettings>
        );
      }
      case "overlay": {
        return (
          <ComponentSettings>
            <OverlaySettings component={component} />
          </ComponentSettings>
        );
      }
      case "gallery": {
        return (
          <ComponentSettings>
            <GallerySettings component={component} />
          </ComponentSettings>
        );
      }
      case "reveal": {
        return (
          <ComponentSettings>
            <RevealSettings component={component} />
          </ComponentSettings>
        );
      }
    }
  }
}

/*
 |--------------------------------------------------------------------------------
 | Container
 |--------------------------------------------------------------------------------
 */

const Container = styled.div`
  position: relative;
  background: ${Color.Background};
  color: ${Color.Font};
  border-left: 1px solid ${Color.Border};
  font-size: ${Font.Size};
  font-family: ${Font.Family};
  width: 364px;
  height: 100vh;

  i {
    color: ${Color.Font};
  }

  button {
    background: ${Color.BackgroundLight};
    border: 1px solid ${Color.BorderLight};
    color: ${Color.FontLight};
    font-size: ${Font.Size};
    padding: 10px;

    cursor: pointer;

    > i {
      display: block;
      font-size: 12px;
    }

    &:hover {
      background: ${Color.BackgroundLightHover};
    }
  }
`;

/*
 |--------------------------------------------------------------------------------
 | Misc
 |--------------------------------------------------------------------------------
 */

const ComponentSettings = styled.div``;

const NoSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: rgba(0, 0, 0, 0.05);
  width: 100%;
  height: 100%;
  font-weight: 300;
`;

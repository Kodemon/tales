import * as React from "react";
import styled from "styled-components";

import { Component } from "Engine/Component";
import { Source } from "Engine/Enums";
import { Page } from "Engine/Page";
import { Section } from "Engine/Section";
import { Stack } from "Engine/Stack";

import { ColorPicker } from "./Components/ColorPicker";
import { DataSetting } from "./Components/DataSetting";
import { StackLayout } from "./Components/StackLayout";
import { GallerySettings } from "./Settings/Gallery";
import { ImageSettings } from "./Settings/Image";
import { OverlaySettings } from "./Settings/Overlay";
import { RevealSettings } from "./Settings/Reveal";
import { TextSettings } from "./Settings/Text";

export class Sidebar extends React.Component<
  {
    page: Page;
    section?: Section;
  },
  {
    stack: string;
    component: string;
  }
> {
  private editListenerEnabled = false;

  constructor(props: any) {
    super(props);
    this.state = {
      stack: "",
      component: ""
    };
  }

  public ComponentDidUpdate(prevState: any, prevProps: any) {
    if (this.props.page && !this.editListenerEnabled) {
      console.log("Updated");
      this.editListenerEnabled = true;
      this.props.page.on("edit", (section: Section, stack: Stack, component: Component) => {
        console.log(stack, component);
        this.setState(() => ({
          stack: stack ? stack.id : "",
          component: component ? component.id : ""
        }));
      });
    }
  }

  public render() {
    const { section } = this.props;
    if (!section) {
      return (
        <Container>
          <NoSection>
            <div>Select a section to start editing</div>
          </NoSection>
        </Container>
      );
    }
    return (
      <Container key={`section-${section.id}`}>
        <Category>
          <CategoryHeader>
            <h1>
              Section
              <small>{section.getSetting("name", section.id)}</small>
            </h1>
          </CategoryHeader>
          <CategoryContent>
            <DataSetting entity={section} type="input" label="Name" attr="settings.name" placeholder={section.id} />
            <DataSetting
              entity={section}
              type="select"
              label="Position"
              attr="settings.position"
              options={[{ label: "Relative", value: "relative" }, { label: "Absolute", value: "absolute" }, { label: "Sticky", value: "sticky" }]}
            />
            <DataSetting
              entity={section}
              type="input"
              label="Height"
              attr="settings.height"
              fallback={1}
              placeholder="100"
              onValue={value => value * 100}
              onChange={value => (value === "" ? 0 : parseFloat(value) / 100)}
            />
            <ColorPicker label="Background Color" effected={section} />
          </CategoryContent>
        </Category>
        <Category>
          <CategoryHeader>
            <h1>Stacks</h1>
          </CategoryHeader>
          {this.renderStacks(section)}
        </Category>
        <Category>
          <CategoryHeader>
            <h1>Components</h1>
          </CategoryHeader>
          {this.state.stack && this.renderComponents(section.getStack(this.state.stack))}
        </Category>
      </Container>
    );
  }

  private renderStacks(section: Section) {
    return (
      <Stacks>
        {section.stacks.map(stack => (
          <StackContainer key={stack.id}>
            <StackHeader onClick={() => this.setState(() => ({ stack: this.state.stack === stack.id ? "" : stack.id }))}>
              <h1>{stack.getSetting("name", stack.id)}</h1>
              <div>
                <i className={`fa fa-caret-${this.state.stack === stack.id ? "up" : "down"}`} />
              </div>
            </StackHeader>
            {this.state.stack === stack.id && (
              <StackContent>
                <DataSetting entity={stack} type="input" label="Name" attr="settings.name" placeholder={stack.id} />
                <DataSetting
                  entity={stack}
                  type="select"
                  label="Position"
                  attr="settings.position"
                  options={[{ label: "Relative", value: "relative" }, { label: "Absolute", value: "absolute" }, { label: "Sticky", value: "sticky" }]}
                />
                <StackLayout stack={stack} />
              </StackContent>
            )}
          </StackContainer>
        ))}
        <StackContainer key="stack:add">
          <StackHeader style={{ textAlign: "center", cursor: "pointer" }} onClick={() => section.addStack({}, Source.User)}>
            <h1>Add Stack</h1>
          </StackHeader>
        </StackContainer>
      </Stacks>
    );
  }

  private renderComponents(stack?: Stack) {
    return (
      <Components>
        {stack &&
          stack.components.map(component => (
            <ComponentContainer key={component.id}>
              <ComponentHeader onClick={() => this.setState(() => ({ component: this.state.component === component.id ? "" : component.id }))}>
                <h1>
                  {component.getSetting("name", component.id)}
                  <small>{component.type}</small>
                </h1>
                <div>
                  <i className={`fa fa-caret-${this.state.component === component.id ? "up" : "down"}`} />
                </div>
              </ComponentHeader>
              {this.state.component && this.renderComponent(component)}
            </ComponentContainer>
          ))}
        <ComponentList>
          <button
            type="button"
            onClick={() => {
              stack.addComponent(
                {
                  type: "text",
                  style: {
                    padding: "40px 20px"
                  }
                },
                Source.User
              );
            }}
          >
            <i className="fa fa-font" /> <span>Text</span>
          </button>
          <button
            type="button"
            onClick={() => {
              stack.addComponent(
                {
                  type: "image",
                  settings: {
                    src: "https://jdrf.org.uk/wp-content/uploads/2017/06/placeholder-image.jpg"
                  },
                  style: {
                    maxWidth: "100%",
                    height: "auto"
                  }
                },
                Source.User
              );
            }}
          >
            <i className="fa fa-picture-o" /> <span>Image</span>
          </button>
          <button
            type="button"
            onClick={() => {
              stack.addComponent(
                {
                  type: "overlay",
                  settings: {
                    type: "topToBottom",
                    background: "rgba(0,0,0,.5)"
                  }
                },
                Source.User
              );
            }}
          >
            <i className="fa fa-adjust" /> <span>Overlay</span>
          </button>
          <button
            type="button"
            onClick={() => {
              stack.addComponent(
                {
                  type: "gallery",
                  settings: {
                    items: [
                      {
                        src: "https://images.unsplash.com/photo-1497431187953-886f6a75d2a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                        transition: "none"
                      },
                      {
                        src: "https://images.unsplash.com/photo-1547782793-e1444139967a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
                        transition: "up"
                      },
                      {
                        src: "https://images.unsplash.com/photo-1495887633121-f1156ca7f6a0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
                        transition: "right"
                      },
                      {
                        src: "https://images.unsplash.com/photo-1497048679117-1a29644559e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
                        transition: "down"
                      },
                      {
                        src: "https://images.unsplash.com/photo-1517697471339-4aa32003c11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80",
                        transition: "left"
                      },
                      {
                        src: "https://images.unsplash.com/photo-1554726425-ac299472ae80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1329&q=80",
                        transition: "fade"
                      }
                    ]
                  }
                },
                Source.User
              );
            }}
          >
            <i className="fa fa-picture-o" /> <span>Gallery</span>
          </button>
          <button
            type="button"
            onClick={() => {
              stack.addComponent(
                {
                  type: "reveal",
                  settings: {
                    items: [
                      {
                        src: "https://images.unsplash.com/photo-1497431187953-886f6a75d2a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                        transition: "none"
                      },
                      {
                        src: "https://images.unsplash.com/photo-1547782793-e1444139967a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
                        transition: "up"
                      },
                      {
                        src: "https://images.unsplash.com/photo-1495887633121-f1156ca7f6a0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
                        transition: "right"
                      },
                      {
                        src: "https://images.unsplash.com/photo-1497048679117-1a29644559e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
                        transition: "down"
                      },
                      {
                        src: "https://images.unsplash.com/photo-1517697471339-4aa32003c11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80",
                        transition: "left"
                      },
                      {
                        src: "https://images.unsplash.com/photo-1554726425-ac299472ae80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1329&q=80",
                        transition: "fade"
                      }
                    ]
                  }
                },
                Source.User
              );
            }}
          >
            <i className="fa fa-eye" /> <span>Reveal</span>
          </button>
        </ComponentList>
      </Components>
    );
  }

  private renderComponent(component: Component) {
    switch (component.type) {
      case "image": {
        return (
          <ComponentContent>
            <ImageSettings component={component} />
          </ComponentContent>
        );
      }
      case "text": {
        return (
          <ComponentContent>
            <TextSettings component={component} />
          </ComponentContent>
        );
      }
      case "overlay": {
        return (
          <ComponentContent>
            <OverlaySettings component={component} />
          </ComponentContent>
        );
      }
      case "gallery": {
        return (
          <ComponentContent>
            <GallerySettings component={component} />
          </ComponentContent>
        );
      }
      case "reveal": {
        return (
          <ComponentContent>
            <RevealSettings component={component} />
          </ComponentContent>
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
  background: #f6f6f6;
  color: #262626;
  border-left: 1px solid #ccc;
  font-family: "Roboto", sans-serif;
  height: 100vh;

  overflow-y: scroll;
  overflow-x: hidden;
`;

/*
 |--------------------------------------------------------------------------------
 | Category
 |--------------------------------------------------------------------------------
 */

const Category = styled.div``;

const CategoryHeader = styled.div`
  position: relative;

  background: #fafafa;
  border-bottom: 1px solid #ccc;
  padding: 6px 10px;

  > h1 {
    display: inline;
    font-size: 1.2em;
    font-weight: 300;

    > small {
      margin-left: 3px;
      font-size: 68%;
      font-weight: 400;
    }
  }
`;

const CategoryContent = styled.div`
  border-bottom: 1px solid #ccc;
  padding: 10px;
`;

/*
 |--------------------------------------------------------------------------------
 | Stacks
 |--------------------------------------------------------------------------------
 */

const Stacks = styled.div``;

const StackContainer = styled.div``;

const StackHeader = styled.div`
  position: relative;

  background: #f3f3f3;
  border-bottom: 1px solid #ccc;
  padding: 5px 10px;

  > h1 {
    display: inline;
    font-size: 0.788em;
    font-weight: 300;

    > small {
      margin-left: 3px;
      font-size: 68%;
      font-weight: 400;
    }
  }

  > div {
    float: right;
  }
`;

const StackContent = styled.div`
  border-bottom: 1px solid #ccc;
  padding: 10px;
`;

/*
 |--------------------------------------------------------------------------------
 | Comopnents
 |--------------------------------------------------------------------------------
 */

const Components = styled.div``;

const ComponentContainer = styled.div``;

const ComponentHeader = styled.div`
  position: relative;

  background: #f3f3f3;
  border-bottom: 1px solid #ccc;
  padding: 5px 10px;

  > h1 {
    display: inline;
    font-size: 0.788em;
    font-weight: 300;

    > small {
      margin-left: 3px;
      font-size: 79%;
      font-weight: 400;
      text-transform: capitalize;
    }
  }

  > div {
    float: right;
  }
`;

const ComponentContent = styled.div`
  border-bottom: 1px solid #ccc;
  padding: 10px;

  > h1 {
    border-bottom: 1px solid #ccc;
    font-size: 0.77em;
    font-weight: 300;
    margin-top: 15px;
    margin-bottom: 10px;
  }
`;

const ComponentList = styled.div`
  padding: 10px;

  button {
    padding: 10px;
    margin: 5px;
    width: calc(50% - 10px);

    > span {
      display: block;
    }
  }
`;

/*
 |--------------------------------------------------------------------------------
 | Misc
 |--------------------------------------------------------------------------------
 */

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

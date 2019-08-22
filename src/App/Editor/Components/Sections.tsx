import * as React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

import { Source } from "Engine/Enums";
import { Page } from "Engine/Page";
import { Section } from "Engine/Section";
import { Stack } from "Engine/Stack";

export class Sections extends React.Component<
  {
    page: Page;
    active: {
      section: string;
      stack: string;
      component: string;
    };
    edit: (section: Section, stack?: Stack, component?: any) => void;
  },
  {
    expanded: Set<string>;
  }
> {
  constructor(props: any, state: any) {
    super(props, state);

    let expanded: Set<string> = new Set();

    const cache = localStorage.getItem("editor.sections");
    if (cache) {
      expanded = new Set(JSON.parse(cache));
    }

    this.state = { expanded };
  }

  private onDragEnd = ({ type, source, destination }: any) => {
    if (type === "SECTION") {
      this.props.page.moveSection(source.index, destination.index, Source.User);
    }
  };

  public render() {
    if (this.props.page.sections.length === 0) {
      return (
        <AddSectionButton
          onClick={() => {
            this.props.page.addSection({}, 0, Source.User);
          }}
        >
          Add Section
        </AddSectionButton>
      );
    }
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId={this.props.page.id} type="SECTION">
          {(provided, snapshot) => (
            <SectionIndex ref={provided.innerRef} style={{ backgroundColor: "#fcfcfc" }} {...provided.droppableProps}>
              {this.props.page.sections.map((section, index) => {
                return (
                  <React.Fragment key={section.id}>
                    <Draggable draggableId={section.id} index={index}>
                      {(provided, snapshot) => (
                        <div key={section.id} ref={provided.innerRef} {...provided.draggableProps}>
                          <header>
                            <i className="fa fa-bars" style={{ marginRight: 5, fontSize: "0.9rem" }} {...provided.dragHandleProps} />
                            {index} -
                            <span
                              className="anchor"
                              onClick={() => {
                                this.props.edit(section);
                              }}
                            >
                              {this.props.active.section === section.id ? (
                                <strong style={{ color: "#1B83BA" }}>{section.getSetting("name", section.id)}</strong>
                              ) : (
                                section.getSetting("name", section.id)
                              )}
                            </span>
                            <RemoveSection
                              onClick={() => {
                                section.remove();
                              }}
                            >
                              <i className="fa fa-trash" />
                            </RemoveSection>
                          </header>
                          {this.state.expanded.has(section.id) && this.renderStacks(section)}
                        </div>
                      )}
                    </Draggable>
                    <AddSection>
                      <button
                        onClick={() => {
                          this.props.page.addSection({}, index + 1, Source.User);
                        }}
                      >
                        <i className="fa fa-plus" />
                      </button>
                    </AddSection>
                  </React.Fragment>
                );
              })}
            </SectionIndex>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  private renderStacks(section: Section) {
    return (
      <React.Fragment>
        <Droppable droppableId={section.id} type="STACK">
          {(provided, snapshot) => (
            <Stacks ref={provided.innerRef} style={{ backgroundColor: snapshot.isDraggingOver ? "#F0F2E8" : "#fcfcfc" }} {...provided.droppableProps}>
              {section.stacks.map((stack, index) => {
                return (
                  <Draggable key={stack.id} draggableId={stack.id} index={index}>
                    {(provided, snapshot) => (
                      <div className="stack" key={stack.id} ref={provided.innerRef} {...provided.draggableProps}>
                        <i className="fa fa-folder" />
                        <span
                          className="anchor"
                          onClick={() => {
                            this.props.edit(section, stack);
                          }}
                        >
                          {this.props.active.stack === stack.id ? <strong style={{ color: "#1B83BA" }}>{stack.name}</strong> : stack.name}
                        </span>
                        <i className="fa fa-bars" style={{ position: "absolute", top: 7, right: 10, fontSize: "0.9rem" }} {...provided.dragHandleProps} />
                        {this.renderStack(section, stack)}
                      </div>
                    )}
                  </Draggable>
                );
              })}
            </Stacks>
          )}
        </Droppable>
        <AddStack
          onClick={() => {
            section.addStack({}, Source.User);
          }}
        >
          Add Stack
        </AddStack>
      </React.Fragment>
    );
  }

  private renderStack(section: Section, stack: Stack) {
    return (
      <Components>
        <ul style={{ listStyle: "none" }}>
          {stack.components.map(component => {
            return (
              <li className="component" key={component.id}>
                {getComponentIcon(component.type)}
                <span
                  className="anchor"
                  onClick={() => {
                    this.props.edit(section, stack, component);
                  }}
                >
                  {this.props.active.component === component.id ? <strong style={{ color: "#1B83BA" }}>{component.name}</strong> : component.name}
                </span>
              </li>
            );
          })}
        </ul>
      </Components>
    );
  }
}

const SectionIndex = styled.div`
  > div {
    background: #fafafa;
    font-size: 13px;

    > header {
      position: relative;
      padding: 10px;
    }

    .anchor {
      cursor: pointer;
      margin-left: 5px;
    }
  }
`;

const AddSectionButton = styled.button`
  background: none;
  border: 1px solid #ccc;
  border-radius: 0px;
  margin: 10px;
  padding: 10px;
  width: 260px;

  &:hover {
    cursor: pointer;
  }
`;

const AddSection = styled.div`
  position: relative;
  display: flex;
  justify-content: center;

  border-top: 1px solid #ccc;

  > button {
    position: absolute;
    top: -10px;

    background: #fcfcfc;
    border: 1px solid #ccc;
    border-radius: 50%;
    width: 20px;
    height: 20px;

    font-size: 0.68rem;

    &:hover {
      cursor: pointer;
    }

    z-index: 1;
  }
`;

const RemoveSection = styled.button`
  position: absolute;
  top: 8px;
  right: 10px;

  background: none;
  border: 1px solid #e15a5a;

  cursor: pointer;
  padding: 3px 6px;

  i {
    color: #e15a5a !important;
    font-size: 0.73rem;
  }

  &:hover {
    background: #e15a5a;
    i {
      color: #fff !important;
    }
  }
`;

const Stacks = styled.div`
  border-top: 1px solid #ccc;

  .stack {
    position: relative;
    margin: 5px 0 5px 10px;
    padding: 5px;
  }

  .anchor {
    cursor: pointer;
    margin-left: 5px;
  }
`;

const AddStack = styled.button`
  background: none;
  border: 1px solid #ccc;
  border-radius: 0px;
  margin: 10px 56px 15px;
  padding: 6px;
  width: 160px;

  &:hover {
    cursor: pointer;
  }
`;

const Components = styled.div`
  .component {
    margin: 5px 0 5px 10px;
  }

  .anchor {
    cursor: pointer;
    margin-left: 5px;
  }
`;

function getComponentIcon(type: string) {
  switch (type) {
    case "image": {
      return <i className="fa fa-image" style={{ marginRight: 5 }} />;
    }
    case "youTube": {
      return <i className="fa fa-video" style={{ marginRight: 5 }} />;
    }
    case "text": {
      return <i className="fa fa-text-height" style={{ marginRight: 5 }} />;
    }
    case "reveal": {
      return <i className="fa fa-image" style={{ marginRight: 5 }} />;
    }
    case "overlay": {
      return <i className="fa fa-image" style={{ marginRight: 5 }} />;
    }
    case "gallery": {
      return <i className="fa fa-image" style={{ marginRight: 5 }} />;
    }
  }
}

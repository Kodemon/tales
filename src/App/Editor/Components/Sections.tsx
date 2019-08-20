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
      this.props.page.moveSection(source.index, destination.index);
    }
  };

  public render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId={this.props.page.id} type="SECTION">
          {(provided, snapshot) => (
            <SectionList ref={provided.innerRef} style={{ backgroundColor: "#fcfcfc" }} {...provided.droppableProps}>
              {this.props.page.sections.map((section, index) => {
                return (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <div key={section.id} ref={provided.innerRef} {...provided.draggableProps}>
                        <header>
                          <i className="fa fa-bars" style={{ marginRight: 5 }} {...provided.dragHandleProps} />
                          {index} -
                          <span
                            className="anchor"
                            onClick={() => {
                              this.props.edit(section);
                            }}
                          >
                            {this.props.active.section === section.id ? <strong style={{ color: "#1B83BA" }}>{section.name}</strong> : section.name}
                          </span>
                          <button
                            style={{ position: "absolute", top: 10, right: 10, padding: "0 2px", cursor: "pointer" }}
                            onClick={() => {
                              section.addStack({}, Source.User);
                            }}
                          >
                            <i className="fa fa-plus" />
                          </button>
                        </header>
                        {this.renderStacks(section)}
                      </div>
                    )}
                  </Draggable>
                );
              })}
            </SectionList>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  private renderStacks(section: Section) {
    return (
      <Droppable droppableId={section.id} type="STACK">
        {(provided, snapshot) => (
          <Stacks ref={provided.innerRef} style={{ backgroundColor: snapshot.isDraggingOver ? "#F0F2E8" : "#fcfcfc" }} {...provided.droppableProps}>
            {section.stacks.map((stack, index) => {
              return (
                <Draggable key={section.id} draggableId={stack.id} index={index}>
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
                      <i className="fa fa-bars" style={{ position: "absolute", right: 0 }} {...provided.dragHandleProps} />
                      {this.renderStack(section, stack)}
                    </div>
                  )}
                </Draggable>
              );
            })}
          </Stacks>
        )}
      </Droppable>
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

const SectionList = styled.div`
  > div {
    background: #fcfcfc;
    border-bottom: 1px dashed #ccc;
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

const Stacks = styled.div`
  border-top: 1px dashed #ccc;
  padding: 10px;
  min-height: 30px;

  .stack {
    position: relative;
    margin: 5px 0 5px 10px;
  }

  .anchor {
    cursor: pointer;
    margin-left: 5px;
  }
`;

const Components = styled.div`
  padding: 5px 10px;

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

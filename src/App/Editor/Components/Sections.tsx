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

  private onDragEnd = ({ source, destination }: any) => {
    this.props.page.moveSection(source.index, destination.index);
  };

  public render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="sections" type="SECTIONS">
          {(provided, snapshot) => (
            <SectionList ref={provided.innerRef} style={{ backgroundColor: snapshot.isDraggingOver ? "blue" : "#fcfcfc" }} {...provided.droppableProps}>
              {this.props.page.sections.map((section, index) => {
                return (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <div key={section.id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <header>
                          <i className="fa fa-puzzle-piece" style={{ marginRight: 5 }} />
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
                        {this.renderSection(section)}
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

  private renderSection(section: Section) {
    return (
      <Stacks>
        <ul style={{ listStyle: "none" }}>
          {section.stacks.map(stack => {
            return (
              <li className="stack" key={stack.id}>
                <i className="fa fa-folder" />{" "}
                <span
                  className="anchor"
                  onClick={() => {
                    this.props.edit(section, stack);
                  }}
                >
                  {this.props.active.stack === stack.id ? <strong style={{ color: "#1B83BA" }}>{stack.name}</strong> : stack.name}
                </span>
                {this.renderStack(section, stack)}
              </li>
            );
          })}
        </ul>
      </Stacks>
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

  .stack {
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

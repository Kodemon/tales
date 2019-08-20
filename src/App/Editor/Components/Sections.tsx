import * as React from "react";
import styled from "styled-components";

import { Source } from "Engine/Enums";
import { Page } from "Engine/Page";
import { Section } from "Engine/Section";
import { Stack } from "Engine/Stack";

export class Sections extends React.Component<
  {
    page: Page;
    active: string;
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

  public render() {
    /*
    const expanded = this.state.expanded;
    if (expanded.has(section.id)) {
      expanded.delete(section.id);
    } else {
      expanded.add(section.id);
    }
    this.setState(() => ({ expanded }));
    localStorage.setItem("editor.sections", JSON.stringify(Array.from(expanded)));
    */
    return (
      <SectionList>
        {this.props.page.sections.map((section, index) => {
          return (
            <li key={section.id}>
              <header
                onClick={() => {
                  this.props.edit(section);
                }}
              >
                <i className="fa fa-puzzle-piece" style={{ marginRight: 5 }} />
                {index} - {section.id}
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
            </li>
          );
        })}
      </SectionList>
    );
  }

  private renderSection(section: Section) {
    // if (!this.state.expanded.has(section.id)) {
    //   return null;
    // }
    return (
      <Stacks>
        <ul style={{ listStyle: "none" }}>
          {section.stacks.map(stack => {
            return (
              <li className="stack" key={stack.id}>
                <i className="fa fa-folder" />{" "}
                <span
                  onClick={() => {
                    this.props.edit(section, stack);
                  }}
                >
                  {stack.name}
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
              <li
                className="component"
                key={component.id}
                onClick={() => {
                  this.props.edit(section, stack, component);
                }}
              >
                {getComponentIcon(component.type)} {this.props.active === component.id ? <strong style={{ color: "#1B83BA" }}>{component.name}</strong> : component.name}
              </li>
            );
          })}
        </ul>
      </Components>
    );
  }
}

const SectionList = styled.ul`
  > li {
    border-bottom: 1px dashed #ccc;
    font-size: 13px;

    > header {
      position: relative;
      padding: 10px;
      &:hover {
        cursor: pointer;
      }
    }
  }
`;

const Stacks = styled.div`
  border-top: 1px dashed #ccc;
  padding: 10px;

  .stack {
    margin: 5px 0 5px 10px;
    &:hover {
      cursor: pointer;
    }
  }
`;

const Components = styled.div`
  padding: 5px 10px;

  .component {
    margin: 5px 0 5px 10px;
    &:hover {
      cursor: pointer;
    }
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

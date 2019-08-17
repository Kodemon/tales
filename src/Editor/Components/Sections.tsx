import * as React from "react";
import styled from "styled-components";

import { Page } from "Engine/Page";
import { Section } from "Engine/Section";

export class Sections extends React.Component<
  {
    page: Page;
    editComponent: (section: Section, component: any) => void;
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

  /**
   * Add a new image component to the provided section.
   *
   * @param section
   */
  private addImage = (section: Section) => {
    section.addComponent(
      {
        type: "image",
        src: "https://jdrf.org.uk/wp-content/uploads/2017/06/placeholder-image.jpg",
        style: {
          maxWidth: "100%",
          height: "auto"
        }
      },
      true
    );
  };

  /**
   * Add a new text component to the provided section.
   *
   * @param section
   */
  private addText = (section: Section) => {
    section.addComponent(
      {
        type: "text",
        style: {
          padding: "40px 20px"
        }
      },
      true
    );
  };

  public render() {
    return (
      <SectionList>
        {this.props.page.sections.map((section, index) => {
          return (
            <li key={section.id}>
              <header
                onClick={() => {
                  const expanded = this.state.expanded;
                  if (expanded.has(section.id)) {
                    expanded.delete(section.id);
                  } else {
                    expanded.add(section.id);
                  }
                  this.setState(() => ({ expanded }));
                  localStorage.setItem("editor.sections", JSON.stringify(Array.from(expanded)));
                }}
              >
                <i className="fa fa-puzzle-piece" style={{ marginRight: 5 }} />
                {index} - {section.id}
              </header>
              {this.renderSection(section)}
            </li>
          );
        })}
      </SectionList>
    );
  }

  private renderSection(section: Section) {
    if (!this.state.expanded.has(section.id)) {
      return null;
    }
    return (
      <Components>
        <ul style={{ listStyle: "none" }}>
          {section.components.map(component => {
            return (
              <li
                className="component"
                key={component.id}
                onClick={() => {
                  this.props.editComponent(section, component);
                }}
              >
                {getComponentIcon(component.type)} {component.type}
              </li>
            );
          })}
        </ul>
        <button
          onClick={() => {
            this.addImage(section);
          }}
        >
          Add Image
        </button>
        <button
          onClick={() => {
            this.addText(section);
          }}
        >
          Add Text
        </button>
      </Components>
    );
  }
}

const SectionList = styled.ul`
  > li {
    border-bottom: 1px dashed #ccc;
    font-size: 13px;

    > header {
      padding: 10px;
      &:hover {
        cursor: pointer;
      }
    }
  }
`;

const Components = styled.div`
  border-top: 1px dashed #ccc;
  padding: 10px;

  .component {
    margin: 5px 0 5px 20px;
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
  }
}

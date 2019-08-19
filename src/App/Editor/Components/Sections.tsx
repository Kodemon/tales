import * as React from "react";
import styled from "styled-components";

import { Page } from "Engine/Page";
import { Section } from "Engine/Section";

export class Sections extends React.Component<
  {
    page: Page;
    active: string;
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
   * Add a new gallery component to the provided section.
   *
   * @param section
   */
  private addGallery = (section: Section) => {
    section.addComponent(
      {
        type: "gallery",
        items: [
          {
            src: "https://images.unsplash.com/photo-1497431187953-886f6a75d2a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          },
          {
            src: "https://images.unsplash.com/photo-1547782793-e1444139967a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
          },
          {
            src: "https://images.unsplash.com/photo-1495887633121-f1156ca7f6a0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
          },
          {
            src: "https://images.unsplash.com/photo-1517697471339-4aa32003c11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"
          },
          {
            src: "https://images.unsplash.com/photo-1554726425-ac299472ae80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1329&q=80"
          }
        ]
      },
      true
    );
  };

  /**
   * Add a new overlay component to the provided section.
   *
   * @param section
   */
  private addOverlay = (section: Section) => {
    section.addComponent(
      {
        type: "overlay",
        settings: {
          type: "topToBottom",
          background: "rgba(0,0,0,.5)"
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

  /**
   * Add a new text component to the provided section.
   *
   * @param section
   */
  private addReveal = (section: Section) => {
    section.addComponent(
      {
        type: "reveal",
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
                {getComponentIcon(component.type)} {this.props.active === component.id ? <strong style={{ color: "#1B83BA" }}>{component.getTitle()}</strong> : component.getTitle()}
              </li>
            );
          })}
        </ul>
        <button
          onClick={() => {
            this.addImage(section);
          }}
        >
          + Image
        </button>
        <button
          onClick={() => {
            this.addGallery(section);
          }}
        >
          + Gallery
        </button>
        <button
          onClick={() => {
            this.addOverlay(section);
          }}
        >
          + Overlay
        </button>
        <button
          onClick={() => {
            this.addText(section);
          }}
        >
          + Text
        </button>
        <button
          onClick={() => {
            this.addReveal(section);
          }}
        >
          + Reveal
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
    case "overlay": {
      return <i className="fa fa-image" style={{ marginRight: 5 }} />;
    }
    case "gallery": {
      return <i className="fa fa-image" style={{ marginRight: 5 }} />;
    }
  }
}

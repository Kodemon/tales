import * as React from "react";
import styled from "styled-components";

import { Source } from "Engine/Enums";
import { Stack } from "Engine/Stack";

import { SettingGroup, SettingGroupStacked } from "../Styles";

export const StackSettings: React.SFC<{
  stack: Stack;
}> = function StackSettings({ stack }) {
  return (
    <Components key={`stack-${stack.id}`} style={{ padding: 10 }}>
      Components
      <div>
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
      </div>
    </Components>
  );
};

const Components = styled.div`
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

  /**
   * Add a new gallery component to the provided section.
   *
   * @param section
   *
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
   *
  private addOverlay = (section: Section) => {
    // section.addComponent(
    //   {
    //     type: "overlay",
    //     settings: {
    //       type: "topToBottom",
    //       background: "rgba(0,0,0,.5)"
    //     }
    //   },
    //   true
    // );
  };

  /**
   * Add a new text component to the provided section.
   *
   * @param section
   *
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
  */

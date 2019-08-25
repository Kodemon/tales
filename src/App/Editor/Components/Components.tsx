import * as React from "react";
import styled from "styled-components";

import { Source } from "Engine/Enums";
import { Section } from "Engine/Section";
import { Stack } from "Engine/Stack";

import { Color } from "../../Variables";

export const Components: React.SFC<{ section: Section; stack?: Stack; edit: (section?: string, stack?: string, component?: string) => void; close: () => void }> = function Components({
  section,
  stack,
  edit,
  close
}) {
  function addComponent(data: any) {
    stack = stack || section.addStack({}, Source.User);
    const component = stack.addComponent(data, Source.User);
    if (component) {
      edit(section.id, stack.id, component.id);
    } else {
      edit(section.id, stack.id);
    }
    close();
  }
  return (
    <Container>
      <button
        type="button"
        onClick={addComponent.bind(null, {
          type: "text",
          style: {
            padding: "40px 20px"
          }
        })}
      >
        <i className="fa fa-font" /> <span>Text</span>
      </button>
      <button
        type="button"
        onClick={addComponent.bind(null, {
          type: "image",
          settings: {
            src: "https://jdrf.org.uk/wp-content/uploads/2017/06/placeholder-image.jpg"
          },
          style: {
            maxWidth: "100%",
            height: "auto"
          }
        })}
      >
        <i className="fa fa-picture-o" /> <span>Image</span>
      </button>
      <button
        type="button"
        onClick={addComponent.bind(null, {
          type: "youTube",
          settings: {
            id: "FnO6WjJHrGc"
          },
          style: {
            maxWidth: "100%",
            height: "auto"
          }
        })}
      >
        <i className="fa fa-youtube-play" /> <span>YouTube</span>
      </button>
      <button
        type="button"
        onClick={addComponent.bind(null, {
          type: "vimeo",
          settings: {
            id: "352206373"
          },
          style: {
            maxWidth: "100%",
            height: "auto"
          }
        })}
      >
        <i className="fa fa-vimeo" /> <span>Vimeo</span>
      </button>
      <button
        type="button"
        onClick={addComponent.bind(null, {
          type: "overlay",
          settings: {
            type: "topToBottom",
            background: "rgba(0,0,0,.5)"
          }
        })}
      >
        <i className="fa fa-adjust" /> <span>Overlay</span>
      </button>
      <button
        type="button"
        onClick={addComponent.bind(null, {
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
        })}
      >
        <i className="fa fa-picture-o" /> <span>Gallery</span>
      </button>
      <button
        type="button"
        onClick={() => {
          addComponent({
            type: "reveal",
            settings: {
              items: [
                {
                  src: "https://images.unsplash.com/photo-1545906785-38f53f99e380?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
                  transition: "none"
                },
                {
                  src: "https://images.unsplash.com/photo-1543869664-290274af6667?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
                  transition: "fade"
                },
                {
                  src: "https://images.unsplash.com/photo-1518443855757-dfadac7101ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
                  transition: "fade"
                }
              ]
            }
          });
        }}
      >
        <i className="fa fa-eye" /> <span>Reveal</span>
      </button>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 0;
  left: -100px;
  bottom: 0;
  z-index: 99;

  background: ${Color.BackgroundDark};
  border-right: 1px solid ${Color.Border};
  padding: 10px;
  width: 100px;

  button {
    display: block;
    margin-bottom: 8px;
    width: 100%;

    > i {
      margin-bottom: 5px;
    }
  }
`;

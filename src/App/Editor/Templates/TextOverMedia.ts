import { generateId } from "Engine/Utils";

export const textOverMedia = {
  name: "Text Over Media",
  layout() {
    const ids = {
      section: generateId(5, "s"),

      backgroundStack: generateId(5, "s"),
      imageComponent: generateId(5, "c"),

      overlayStack: generateId(5, "s"),
      overlayComponent: generateId(5, "c"),

      textStack: generateId(5, "s"),
      textComponent: generateId(5, "c")
    };
    return {
      id: ids.section,
      settings: {
        name: "Text Over Media"
      },
      stacks: [
        {
          id: ids.backgroundStack,
          settings: {
            name: "Background",
            grid: {
              width: 1,
              height: 1,
              areas: {
                [ids.imageComponent]: {
                  column: {
                    start: 1,
                    end: 2,
                    span: 1
                  },
                  row: {
                    start: 1,
                    end: 2,
                    span: 1
                  }
                }
              }
            },
            position: "absolute"
          },
          style: {},
          components: [
            {
              id: ids.imageComponent,
              type: "image",
              area: "",
              settings: {
                src: "https://images.unsplash.com/photo-1505207820475-ad20164d3936?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
                position: "absolute",
                title: "Buffalo",
                altText: "buffalo",
                name: "Buffalo"
              },
              style: {
                maxWidth: "100%",
                height: "auto"
              }
            }
          ]
        },
        {
          id: ids.overlayStack,
          settings: {
            name: "Overlay",
            position: "absolute",
            grid: {
              width: 1,
              height: 1,
              areas: {
                [ids.overlayComponent]: {
                  column: {
                    start: 1,
                    end: 2,
                    span: 1
                  },
                  row: {
                    start: 1,
                    end: 2,
                    span: 1
                  }
                }
              }
            }
          },
          style: {},
          components: [
            {
              id: ids.overlayComponent,
              type: "overlay",
              area: "",
              settings: {
                type: "topToBottom",
                background: "rgba(0,0,0,.5)",
                name: "Shadow"
              },
              style: {
                background: "rgba(37, 37, 39, 0.29)",
                height: "100%"
              }
            }
          ]
        },
        {
          id: ids.textStack,
          settings: {
            name: "Text",
            grid: {
              width: 1,
              height: 1,
              areas: {
                [ids.textComponent]: {
                  column: {
                    start: 1,
                    end: 2,
                    span: 1
                  },
                  row: {
                    start: 1,
                    end: 2,
                    span: 1
                  }
                }
              }
            }
          },
          style: {},
          components: [
            {
              id: ids.textComponent,
              type: "text",
              area: "",
              settings: {
                name: "Component",
                text: {
                  content: {
                    ops: [
                      {
                        attributes: {
                          size: "large"
                        },
                        insert: "Text Over Media"
                      },
                      {
                        attributes: {
                          align: "center"
                        },
                        insert: "\n"
                      }
                    ]
                  },
                  delta: {
                    ops: [
                      {
                        retain: 15,
                        attributes: {
                          size: "large"
                        }
                      }
                    ]
                  }
                },
                html: '<p class="ql-align-center"><span class="ql-size-large">Text Over Media</span></p>',
                layout: "center,center"
              },
              style: {
                padding: "40px 20px",
                columns: "1",
                color: "white",
                fontSize: "2em"
              }
            }
          ]
        }
      ]
    };
  }
};

import { generateId } from "Engine/Utils";

export const text = {
  name: "Text",
  layout() {
    const textComponentId = generateId(5, "c");
    return {
      id: generateId(5, "s"),
      settings: {
        name: "Text",
        height: 0
      },
      stacks: [
        {
          id: "BdOmG8ufZw",
          settings: {
            name: "Text",
            grid: {
              width: 1,
              height: 1,
              areas: {
                [textComponentId]: {
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
              id: textComponentId,
              type: "text",
              area: "",
              settings: {
                name: "Component",
                text: {
                  content: {
                    ops: [
                      {
                        insert: "This is a Text Section. It provides a way to provide long form text to your readers, great for articles and stories."
                      },
                      {
                        attributes: {
                          align: "justify"
                        },
                        insert: "\n\n"
                      },
                      {
                        insert:
                          "Nunc sit amet nulla ultrices, volutpat mauris at, egestas lacus. Pellentesque laoreet leo eu varius pretium. Morbi id semper urna. Fusce eu lobortis dui. Mauris posuere iaculis elit, ut cursus magna cursus vitae. Pellentesque bibendum id elit ut dapibus. Nulla facilisi. Maecenas ullamcorper consequat rhoncus. Cras nec sapien lorem."
                      },
                      {
                        attributes: {
                          align: "justify"
                        },
                        insert: "\n\n"
                      },
                      {
                        insert:
                          "Nunc egestas sem sed purus sollicitudin, eget ultricies tellus luctus. Sed et nulla nibh. Donec scelerisque cursus risus, et aliquet tellus finibus vitae. Nam ullamcorper nisi eu neque varius sodales. Quisque tempus augue ut libero tincidunt imperdiet. Nullam sit amet finibus purus. Duis facilisis condimentum quam, non rhoncus purus faucibus nec. Integer pharetra nulla at tellus congue, vitae viverra quam condimentum. Phasellus vitae congue velit. Vestibulum condimentum elit quis consectetur mattis. Aenean interdum, ante in mattis convallis, erat ipsum maximus libero, et porttitor mi sem eget metus."
                      },
                      {
                        attributes: {
                          align: "justify"
                        },
                        insert: "\n"
                      },
                      {
                        insert: "\n"
                      }
                    ]
                  },
                  delta: {
                    ops: [
                      {
                        retain: 115
                      },
                      {
                        insert: "."
                      }
                    ]
                  }
                },
                html:
                  '<p class="ql-align-justify">This is a Text Section. It provides a way to provide long form text to your readers, great for articles and stories.</p><p class="ql-align-justify"><br></p><p class="ql-align-justify">Nunc sit amet nulla ultrices, volutpat mauris at, egestas lacus. Pellentesque laoreet leo eu varius pretium. Morbi id semper urna. Fusce eu lobortis dui. Mauris posuere iaculis elit, ut cursus magna cursus vitae. Pellentesque bibendum id elit ut dapibus. Nulla facilisi. Maecenas ullamcorper consequat rhoncus. Cras nec sapien lorem.</p><p class="ql-align-justify"><br></p><p class="ql-align-justify">Nunc egestas sem sed purus sollicitudin, eget ultricies tellus luctus. Sed et nulla nibh. Donec scelerisque cursus risus, et aliquet tellus finibus vitae. Nam ullamcorper nisi eu neque varius sodales. Quisque tempus augue ut libero tincidunt imperdiet. Nullam sit amet finibus purus. Duis facilisis condimentum quam, non rhoncus purus faucibus nec. Integer pharetra nulla at tellus congue, vitae viverra quam condimentum. Phasellus vitae congue velit. Vestibulum condimentum elit quis consectetur mattis. Aenean interdum, ante in mattis convallis, erat ipsum maximus libero, et porttitor mi sem eget metus.</p><p><br></p>'
              },
              style: {
                padding: "40px 20px",
                columns: "1"
              }
            }
          ]
        }
      ]
    };
  }
};

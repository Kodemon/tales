import { generateId } from "Engine/Utils";

export const reveal = {
  name: "Reveal",
  layout() {
    const revealComponentId = generateId(5, "c");
    return {
      id: generateId(5, "s"),
      settings: {
        name: "Reveal",
        height: 3
      },
      stacks: [
        {
          id: generateId(5, "s"),
          settings: {
            name: "Reveal",
            grid: {
              width: 1,
              height: 1,
              areas: {
                [revealComponentId]: {
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
              id: revealComponentId,
              type: "reveal",
              area: "",
              settings: {
                name: "Reveal Component",
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
              },
              style: {},
              title: "Component"
            }
          ]
        }
      ]
    };
  }
};

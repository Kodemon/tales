import * as Quill from "quill";

import { Section } from "../Section";
import { maybe, setStyle } from "../Utils";

/**
 * Appends a text layer to the provided container.
 *
 * @param container
 * @param component
 */
export function text(section: Section, component: any) {
  const grid = document.createElement("div");
  setStyle(grid, {
    ...getGridLayout(maybe<string>(component, "settings.layout"), maybe<number>(component, "settings.min"), maybe<number>(component, "settings.max")),
    minHeight: section.height
  });
  if (maybe<boolean>(component, "settings.sticky", false)) {
    setStyle(grid, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%"
    });
  }
  section.append(grid);

  const body = document.createElement("article");
  setStyle(body, {
    gridArea: "text",
    ...maybe(component, "style", {})
  });
  grid.append(body);

  const quill = new Quill(body, {
    theme: "bubble",
    placeholder: "Compose an epic...",
    readOnly: false,
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["blockquote", "code-block"],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ direction: "rtl" }], // text direction

        [{ size: ["small", false, "large", "huge"] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],

        ["clean"] // remove formatting button
      ]
    }
  });

  let debounce: any;
  quill.on("text-change", function(delta: any, oldDelta: any, source: any) {
    // clearTimeout(debounce);
    // debounce = setTimeout(() => {
    section.setComponent({
      ...component,
      text: quill.getContents()
    });
    // }, 2500);
  });

  quill.setContents(component.text);
}

/**
 * Retrieve grid layout for the text.
 *
 * @param layout
 */
function getGridLayout(layout: string = "middle", min: number = 280, max: number = 580): any {
  switch (layout) {
    case "left": {
      return {
        display: "grid",
        gridTemplateColumns: `minmax(${min}px, ${max}px) auto`,
        gridTemplateRows: "1fr",
        gridTemplateAreas: "'text .'"
      };
    }
    case "middle": {
      return {
        display: "grid",
        gridTemplateColumns: `auto minmax(${min}px, ${max}px) auto`,
        gridTemplateRows: "1fr",
        gridTemplateAreas: "'. text .'"
      };
    }
    case "right": {
      return {
        display: "grid",
        gridTemplateColumns: `auto minmax(${min}px, ${max}px)`,
        gridTemplateRows: "1fr",
        gridTemplateAreas: "'. text'"
      };
    }
    case "center": {
      return {
        display: "grid",
        gridTemplateColumns: `auto minmax(${min}px, ${max}px) auto`,
        gridTemplateRows: "1fr auto 1fr",
        gridTemplateAreas: "'. . .' '. text .' '. . .'"
      };
    }
  }
}

import * as Quill from "quill";

import { maybe, setStyle } from "Engine/Utils";

/**
 * Injects quill instance into the provided text component.
 *
 * @param component
 */
export function setTextEditor(component: any) {
  const body = document.createElement("article");
  setStyle(body, {
    gridArea: "text",
    ...maybe(component.data, "style", {})
  });
  component.grid.innerHTML = "";
  component.grid.append(body);

  const quill = new Quill(body, {
    theme: "snow",
    placeholder: "Compose an epic..."
  });

  quill.on("selection-change", (range: any) => {
    if (range) {
      component.section.page.emit("edit", component.section, component);
    }
  });

  quill.on("text-change", (delta: any, oldDelta: any, source: any) => {
    if (source === "user") {
      const data = { content: quill.getContents(), delta };

      component.section.page.conduit.send("component:set", component.section.id, component.id, "text", data);
      component.set("text", data, true);

      component.section.page.conduit.send("component:set", component.section.id, component.id, "html", quill.root.innerHTML);
      component.set("html", quill.root.innerHTML, true);
    }
  });

  quill.setContents(component.data.text);

  component.quill = quill;
}

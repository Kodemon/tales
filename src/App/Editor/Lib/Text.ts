import * as Quill from "quill";

let currentSelection = "";

/**
 * Injects quill instance into the provided text component.
 *
 * @param component
 */
export function setTextEditor(component: any) {
  const body = document.createElement("article");
  const quill = new Quill(body, {
    theme: "snow",
    placeholder: "Compose an epic...",
    modules: {
      toolbar: false
    }
  });

  // ### Selection Change
  // 1. Send a component edit selection when selection has changed.

  quill.on("selection-change", (range: any) => {
    if (range && component.id !== currentSelection) {
      currentSelection = component.id;
      component.section.page.emit("edit", component.section, component);
    }
  });

  // ### Text Change
  // 1. Update the text, and html keys on the component.
  // 2. Send text, and html update events to all connected peers.

  quill.on("text-change", (delta: any, oldDelta: any, source: any) => {
    if (source === "user") {
      const data = { content: quill.getContents(), delta };

      component.page.send("component:set", component.section.id, component.id, "text", data);
      component.set("text", data, true);

      component.page.send("component:set", component.section.id, component.id, "html", quill.root.innerHTML);
      component.set("html", quill.root.innerHTML, true);
    }
  });

  // ### Content
  // 1. Assign the initial component quill text.

  quill.setContents(component.data.text);

  // ### Inject
  // 1. Inject the quill editor, and text body to the component.

  component.setQuill(quill, body);
}

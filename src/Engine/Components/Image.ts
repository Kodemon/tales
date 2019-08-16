import { Section } from "../Section";
import { maybe, setStyle } from "../Utils";

/**
 * Appends a image layer to the provided container.
 *
 * @param section
 * @param component
 */
export function image(section: Section, component: any) {
  const image = document.createElement("img");

  image.src = component.src;

  const position = maybe(component, "settings.position");
  switch (position) {
    case "background": {
      image.className = "component-absolute";
      setStyle(image, {
        objectFit: "cover",
        width: section.page.viewport.width,
        height: section.height * maybe<number>(component, "settings.height", 1)
      });
      section.append(image);
      break;
    }

    case "sticky": {
      const container = document.createElement("div");
      container.className = "component-fixed_container";

      const scroller = document.createElement("div");
      scroller.className = "component-scroll_overlay";

      image.className = "component-fixed_component";
      setStyle(image, {
        objectFit: "cover",
        width: section.page.viewport.width,
        height: "100%"
      });

      container.append(image);
      container.append(scroller);

      section.append(container);
      break;
    }

    default: {
      setStyle(image, {
        display: "block",
        ...(component.style || {})
      });
      section.append(image);
    }
  }
}

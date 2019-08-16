import { Section } from "../Section";
import { setStyle, translate } from "../Utils";

/**
 * Appends a image layer to the provided container.
 *
 * @param section
 * @param component
 */
export function reveal(section: Section, component: any) {
  const offset = 1 / component.images.length;

  // ### Sticky Container

  const container = document.createElement("div");
  container.className = "sticky";
  setStyle(container, {
    position: "sticky",
    top: 0,
    height: section.page.viewport.height,
    width: section.page.viewport.width
  });
  section.append(container);

  // ### Images

  component.images.forEach((component: any, index: number) => {
    const image = document.createElement("div");
    setStyle(image, {
      position: "absolute",
      backgroundImage: `url(${component.src})`,
      backgroundSize: "cover",
      height: section.page.viewport.height,
      width: section.page.viewport.width,
      transform: translate(0, 0, 0)
    });
    container.append(image);

    if (index > 0) {
      const style: any = {};
      switch (component.transition) {
        case "up": {
          setStyle(image, {
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 0,
            backgroundPosition: "center bottom",
            overflow: "hidden",
            transform: translate(0, 0, 0)
          });
          break;
        }
        case "down": {
          setStyle(image, {
            height: 0,
            overflow: "hidden"
          });
          break;
        }
        case "left": {
          setStyle(image, {
            width: 0,
            overflow: "hidden"
          });
          break;
        }
        case "right": {
          setStyle(image, {
            position: "absolute",
            right: 0,
            width: 0,
            backgroundPosition: "center right",
            overflow: "hidden",
            transform: translate(0, 0, 0)
          });
          break;
        }
      }
      setStyle(image, style);

      const start = offset * index;
      const end = start + offset;

      section.scroll.on("progress", (event: any) => {
        const style: any = {};
        const percent = (event.progress - start) / offset; // the percentage of the index 0 - 1
        const fullPercent = Math.floor(percent * 100);

        switch (component.transition) {
          case "swap": {
            style.opacity = start < event.progress && event.progress < end ? 1 : event.progress < start ? 0 : 1;
            break;
          }
          case "fade": {
            style.opacity = percent > 1 ? 1 : percent < 0 ? 0 : percent;
            break;
          }
          case "up": {
            style.height = `${fullPercent < 0 ? 0 : fullPercent > 100 ? 100 : fullPercent}%`;
            break;
          }
          case "down": {
            style.height = `${fullPercent < 0 ? 0 : fullPercent > 100 ? 100 : fullPercent}%`;
            break;
          }
          case "left": {
            style.width = `${fullPercent < 0 ? 0 : fullPercent > 100 ? 100 : fullPercent}%`;
            break;
          }
          case "right": {
            style.width = `${fullPercent < 0 ? 0 : fullPercent > 100 ? 100 : fullPercent}%`;
            break;
          }
        }

        setStyle(image, style);
      });
    } else {
      setStyle(image, {
        position: "absolute",
        left: 0,
        top: 0,
        height: section.page.viewport.height
      });
    }
  });
}

/*
const image = document.createElement("img");

image.src = item.src;

if (item.style) {
  setStyle(image, item.style);
}

let height = maybe(item, "settings.height", 0);
if (height !== 0) {
  setStyle(image, {
    height: scene.height * height
  });
}

scene.append(image);
*/

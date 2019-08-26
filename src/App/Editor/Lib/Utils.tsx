import * as React from "react";

export function getCaretPosition(isActive: boolean) {
  if (isActive) {
    return <i className="fa fa-caret-down" />;
  }
  return <i className="fa fa-caret-right" />;
}

export function getComponentIcon(type: string) {
  switch (type) {
    case "image": {
      return <i className="fa fa-image" style={{ marginRight: 5 }} />;
    }
    case "text": {
      return <i className="fa fa-font" style={{ marginRight: 5 }} />;
    }
    case "overlay": {
      return <i className="fa fa-adjust" style={{ marginRight: 5 }} />;
    }
    case "reveal": {
      return <i className="fa fa-adjust" style={{ marginRight: 5 }} />;
    }
    case "vimeo": {
      return <i className="fa fa-vimeo" style={{ marginRight: 5 }} />;
    }
    case "youTube": {
      return <i className="fa fa-youtube-play" style={{ marginRight: 5 }} />;
    }
  }
}

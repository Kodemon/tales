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
  }
}

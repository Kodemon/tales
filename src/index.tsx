import * as React from "react";
import * as ReactDOM from "react-dom";

import { Editor } from "./Editor";
import { Reader } from "./Reader";

const urlParams = new URLSearchParams(window.location.search);

if (!!urlParams.get("edit")) {
  ReactDOM.render(React.createElement(Editor), document.getElementById("app"));
} else {
  ReactDOM.render(React.createElement(Reader), document.getElementById("app"));
}

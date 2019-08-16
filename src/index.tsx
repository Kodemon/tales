import * as React from "react";
import * as ReactDOM from "react-dom";

import { Editor } from "./Editor";

const urlParams = new URLSearchParams(window.location.search);

// if (!!urlParams.get("edit")) {
//   ReactDOM.render(React.createElement(Editor), document.getElementById("app"));
// }

ReactDOM.render(React.createElement(Editor), document.getElementById("app"));

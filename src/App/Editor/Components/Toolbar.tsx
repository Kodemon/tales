import * as Quill from "quill";
import * as React from "react";

import { maybe } from "Engine/Utils";

const QuillFont = Quill.import("formats/font");

QuillFont.whitelist = ["merriweather", "roboto"];
Quill.register(QuillFont, true);

export class Toolbar extends React.Component<
  {
    quill: typeof Quill;
  },
  {
    format: any;
    selector: string;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      format: this.props.quill.getFormat(),
      selector: ""
    };
  }

  public componentDidMount() {
    this.props.quill.on("text-change", this.onChange);
    this.props.quill.on("selection-change", this.onSelect);
    window.addEventListener("mouseup", this.onMouseUp);
  }

  public componentWillUnmount() {
    this.props.quill.off("text-change", this.onChange);
    this.props.quill.off("selection-change", this.onSelect);
    window.removeEventListener("mouseup", this.onMouseUp);
  }

  public onChange = (delta: any) => {
    if (delta) {
      this.setState(() => ({ format: this.props.quill.getFormat() }));
    }
  };

  public onSelect = (range: any) => {
    if (range) {
      this.setState(() => ({ format: this.props.quill.getFormat() }));
    }
  };

  public onMouseUp = () => {
    this.setState(() => ({ selector: "" }));
  };

  public render() {
    return (
      <div className="toolbar ql-toolbar ql-snow">
        <div className="ql-formats">{this.font()}</div>
        <div className="ql-formats">{this.size()}</div>
        <div className="ql-formats">
          {this.bold()}
          {this.italic()}
          {this.underline()}
          {this.strike()}
        </div>
        <div className="ql-formats">
          {this.headerOne()}
          {this.headerTwo()}
        </div>
        <div className="ql-formats">{this.quote()}</div>
        <div className="ql-formats">
          {this.orderedList()}
          {this.bulletList()}
        </div>
        <div className="ql-formats">
          {this.alignLeft()}
          {this.alignCenter()}
          {this.alignRight()}
        </div>
        <div className="ql-formats">
          {this.color()}
          {this.background()}
        </div>
        <div className="ql-formats">{this.clean()}</div>
      </div>
    );
  }

  private font() {
    const value = maybe(this.state.format, "font", "Merriweather");
    return (
      <select
        value={value}
        onChange={e => {
          this.props.quill.format("font", e.target.value, "user");
        }}
      >
        <option value="merriweather">Merriweather</option>
        <option value="roboto">Roboto</option>
      </select>
    );
  }

  private size() {
    const value = maybe(this.state.format, "size", "normal");
    return (
      <select
        value={value}
        onChange={e => {
          let val: string | boolean = false;
          if (e.target.value !== "normal") {
            val = e.target.value;
          }
          this.props.quill.format("size", val, "user");
        }}
      >
        <option value="small">Small</option>
        <option value="normal">Normal</option>
        <option value="large">Large</option>
        <option value="huge">Huge</option>
      </select>
    );
  }

  private bold() {
    const isActive = maybe(this.state.format, "bold", false);
    return (
      <button
        className={`ql-bold${isActive ? " ql-active" : ""}`}
        onClick={() => {
          this.props.quill.format("bold", !isActive, "user");
        }}
      >
        <svg viewBox="0 0 18 18">
          <path className="ql-stroke" d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z" />
          <path className="ql-stroke" d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z" />
        </svg>
      </button>
    );
  }

  private italic() {
    const isActive = maybe(this.state.format, "italic", false);
    return (
      <button
        className={`ql-italic${isActive ? " ql-active" : ""}`}
        onClick={() => {
          this.props.quill.format("italic", !isActive, "user");
        }}
      >
        <svg viewBox="0 0 18 18">
          <line className="ql-stroke" x1="7" x2="13" y1="4" y2="4" />
          <line className="ql-stroke" x1="5" x2="11" y1="14" y2="14" />
          <line className="ql-stroke" x1="8" x2="10" y1="14" y2="4" />
        </svg>
      </button>
    );
  }

  private underline() {
    const isActive = maybe(this.state.format, "underline", false);
    return (
      <button
        className={`ql-underline${isActive ? " ql-active" : ""}`}
        onClick={() => {
          this.props.quill.format("underline", !isActive, "user");
        }}
      >
        <svg viewBox="0 0 18 18">
          <path className="ql-stroke" d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3" />
          <rect className="ql-fill" height="1" rx="0.5" ry="0.5" width="12" x="3" y="15" />
        </svg>
      </button>
    );
  }

  private strike() {
    const isActive = maybe(this.state.format, "strike", false);
    return (
      <button
        className={`ql-strike${isActive ? " ql-active" : ""}`}
        onClick={() => {
          this.props.quill.format("strike", !isActive, "user");
        }}
      >
        <svg viewBox="0 0 18 18">
          <line className="ql-stroke ql-thin" x1="15.5" x2="2.5" y1="8.5" y2="9.5"></line>
          <path
            className="ql-fill"
            d="M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z"
          ></path>
          <path
            className="ql-fill"
            d="M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z"
          ></path>
        </svg>
      </button>
    );
  }

  private quote() {
    const isActive = maybe(this.state.format, "blockquote", false);
    return (
      <button
        className={`ql-blockquote${isActive ? " ql-active" : ""}`}
        onClick={() => {
          this.props.quill.format("blockquote", !isActive, "user");
        }}
      >
        <svg viewBox="0 0 18 18">
          <rect className="ql-fill ql-stroke" height="3" width="3" x="4" y="5"></rect>
          <rect className="ql-fill ql-stroke" height="3" width="3" x="11" y="5"></rect>
          <path className="ql-even ql-fill ql-stroke" d="M7,8c0,4.031-3,5-3,5"></path>
          <path className="ql-even ql-fill ql-stroke" d="M14,8c0,4.031-3,5-3,5"></path>
        </svg>
      </button>
    );
  }

  private orderedList() {
    const isActive = maybe(this.state.format, "list") === "ordered";
    return (
      <button
        className={`ql-list${isActive ? " ql-active" : ""}`}
        onClick={() => {
          this.props.quill.format("list", "ordered", "user");
        }}
      >
        <svg viewBox="0 0 18 18">
          <line className="ql-stroke" x1="7" x2="15" y1="4" y2="4"></line>
          <line className="ql-stroke" x1="7" x2="15" y1="9" y2="9"></line>
          <line className="ql-stroke" x1="7" x2="15" y1="14" y2="14"></line>
          <line className="ql-stroke ql-thin" x1="2.5" x2="4.5" y1="5.5" y2="5.5"></line>
          <path
            className="ql-fill"
            d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z"
          ></path>
          <path className="ql-stroke ql-thin" d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156"></path>
          <path className="ql-stroke ql-thin" d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109"></path>
        </svg>
      </button>
    );
  }

  private bulletList() {
    const isActive = maybe(this.state.format, "list") === "bullet";
    return (
      <button
        className={`ql-list${isActive ? " ql-active" : ""}`}
        onClick={() => {
          this.props.quill.format("list", "bullet", "user");
        }}
      >
        <svg viewBox="0 0 18 18">
          <line className="ql-stroke" x1="6" x2="15" y1="4" y2="4"></line>
          <line className="ql-stroke" x1="6" x2="15" y1="9" y2="9"></line>
          <line className="ql-stroke" x1="6" x2="15" y1="14" y2="14"></line>
          <line className="ql-stroke" x1="3" x2="3" y1="4" y2="4"></line>
          <line className="ql-stroke" x1="3" x2="3" y1="9" y2="9"></line>
          <line className="ql-stroke" x1="3" x2="3" y1="14" y2="14"></line>
        </svg>
      </button>
    );
  }

  private headerOne() {
    const isActive = maybe(this.state.format, "header") === 1;
    return (
      <button
        className={`ql-header${isActive ? " ql-active" : ""}`}
        onClick={() => {
          this.props.quill.format("header", isActive ? null : 1, "user");
        }}
      >
        <svg viewBox="0 0 18 18">
          <path
            className="ql-fill"
            d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm6.06787,9.209H14.98975V7.59863a.54085.54085,0,0,0-.605-.60547h-.62744a1.01119,1.01119,0,0,0-.748.29688L11.645,8.56641a.5435.5435,0,0,0-.022.8584l.28613.30762a.53861.53861,0,0,0,.84717.0332l.09912-.08789a1.2137,1.2137,0,0,0,.2417-.35254h.02246s-.01123.30859-.01123.60547V13.209H12.041a.54085.54085,0,0,0-.605.60547v.43945a.54085.54085,0,0,0,.605.60547h4.02686a.54085.54085,0,0,0,.605-.60547v-.43945A.54085.54085,0,0,0,16.06787,13.209Z"
          ></path>
        </svg>
      </button>
    );
  }

  private headerTwo() {
    const isActive = maybe(this.state.format, "header") === 2;
    return (
      <button
        className={`ql-header${isActive ? " ql-active" : ""}`}
        onClick={() => {
          this.props.quill.format("header", isActive ? null : 2, "user");
        }}
      >
        <svg viewBox="0 0 18 18">
          <path
            className="ql-fill"
            d="M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"
          ></path>
        </svg>
      </button>
    );
  }

  private alignLeft() {
    const isActive = maybe(this.state.format, "align") === "justify";
    return (
      <button
        className={`ql-align${isActive ? " ql-active" : ""}`}
        onClick={() => {
          this.props.quill.format("align", "justify", "user");
        }}
      >
        <svg viewBox="0 0 18 18">
          <line className="ql-stroke" x1="3" x2="15" y1="9" y2="9"></line>
          <line className="ql-stroke" x1="3" x2="13" y1="14" y2="14"></line>
          <line className="ql-stroke" x1="3" x2="9" y1="4" y2="4"></line>
        </svg>
      </button>
    );
  }

  private alignCenter() {
    const isActive = maybe(this.state.format, "align") === "center";
    return (
      <button
        className={`ql-align${isActive && " ql-active"}`}
        onClick={() => {
          this.props.quill.format("align", "center", "user");
        }}
      >
        <svg viewBox="0 0 18 18">
          <line className="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>
          <line className="ql-stroke" x1="14" x2="4" y1="14" y2="14"></line>
          <line className="ql-stroke" x1="12" x2="6" y1="4" y2="4"></line>
        </svg>
      </button>
    );
  }

  private alignRight() {
    const isActive = maybe(this.state.format, "align") === "right";
    return (
      <button
        className={`ql-align${isActive && " ql-active"}`}
        onClick={() => {
          this.props.quill.format("align", "right", "user");
        }}
      >
        <svg viewBox="0 0 18 18">
          <line className="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>
          <line className="ql-stroke" x1="15" x2="5" y1="14" y2="14"></line>
          <line className="ql-stroke" x1="15" x2="9" y1="4" y2="4"></line>
        </svg>
      </button>
    );
  }

  private color() {
    const isActive = maybe(this.state.format, "color", false);
    return (
      <button
        className={`ql-color${isActive && " ql-active"}`}
        onClick={() => {
          this.props.quill.format("color", "#ccc", "user");
        }}
      >
        <svg viewBox="0 0 18 18">
          <line className="ql-color-label ql-stroke ql-transparent" x1="3" x2="15" y1="15" y2="15"></line>
          <polyline className="ql-stroke" points="5.5 11 9 3 12.5 11"></polyline>
          <line className="ql-stroke" x1="11.63" x2="6.38" y1="9" y2="9"></line>
        </svg>
      </button>
    );
  }

  private background() {
    const isActive = maybe(this.state.format, "background", false);
    return (
      <button
        className={`ql-background${isActive && " ql-active"}`}
        onClick={() => {
          this.props.quill.format("background", "#ccc", "user");
        }}
      >
        <svg viewBox="0 0 18 18">
          <g className="ql-fill ql-color-label">
            <polygon points="6 6.868 6 6 5 6 5 7 5.942 7 6 6.868"></polygon>
            <rect height="1" width="1" x="4" y="4"></rect>
            <polygon points="6.817 5 6 5 6 6 6.38 6 6.817 5"></polygon>
            <rect height="1" width="1" x="2" y="6"></rect>
            <rect height="1" width="1" x="3" y="5"></rect>
            <rect height="1" width="1" x="4" y="7"></rect>
            <polygon points="4 11.439 4 11 3 11 3 12 3.755 12 4 11.439"></polygon>
            <rect height="1" width="1" x="2" y="12"></rect> <rect height="1" width="1" x="2" y="9"></rect>
            <rect height="1" width="1" x="2" y="15"></rect> <polygon points="4.63 10 4 10 4 11 4.192 11 4.63 10"></polygon>
            <rect height="1" width="1" x="3" y="8"></rect> <path d="M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z"></path>
            <path d="M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z"></path> <path d="M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z"></path>
            <rect height="1" width="1" x="12" y="2"></rect> <rect height="1" width="1" x="11" y="3"></rect> <path d="M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z"></path>
            <rect height="1" width="1" x="2" y="3"></rect> <rect height="1" width="1" x="6" y="2"></rect> <rect height="1" width="1" x="3" y="2"></rect>
            <rect height="1" width="1" x="5" y="3"></rect> <rect height="1" width="1" x="9" y="2"></rect> <rect height="1" width="1" x="15" y="14"></rect>
            <polygon points="13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174"></polygon> <rect height="1" width="1" x="13" y="7"></rect>
            <rect height="1" width="1" x="15" y="5"></rect> <rect height="1" width="1" x="14" y="6"></rect> <rect height="1" width="1" x="15" y="8"></rect>
            <rect height="1" width="1" x="14" y="9"></rect>
            <path d="M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z"></path> <rect height="1" width="1" x="14" y="3"></rect>
            <polygon points="12 6.868 12 6 11.62 6 12 6.868"></polygon> <rect height="1" width="1" x="15" y="2"></rect>
            <rect height="1" width="1" x="12" y="5"></rect> <rect height="1" width="1" x="13" y="4"></rect> <polygon points="12.933 9 13 9 13 8 12.495 8 12.933 9"></polygon>
            <rect height="1" width="1" x="9" y="14"></rect>
            <rect height="1" width="1" x="8" y="15"></rect> <path d="M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z"></path> <rect height="1" width="1" x="5" y="15"></rect>
            <path d="M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z"></path> <rect height="1" width="1" x="11" y="15"></rect>
            <path d="M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z"></path>
            <rect height="1" width="1" x="14" y="15"></rect> <rect height="1" width="1" x="15" y="11"></rect>
          </g>
          <polyline className="ql-stroke" points="5.5 13 9 5 12.5 13"></polyline>
          <line className="ql-stroke" x1="11.63" x2="6.38" y1="11" y2="11"></line>
        </svg>
      </button>
    );
  }

  private clean() {
    return (
      <button
        className="ql-clean"
        onClick={() => {
          this.props.quill.removeFormat(0, this.props.quill.getLength(), "user");
        }}
      >
        <svg className="" viewBox="0 0 18 18">
          <line className="ql-stroke" x1="5" x2="13" y1="3" y2="3"></line>
          <line className="ql-stroke" x1="6" x2="9.35" y1="12" y2="3"></line>
          <line className="ql-stroke" x1="11" x2="15" y1="11" y2="15"></line>
          <line className="ql-stroke" x1="15" x2="11" y1="11" y2="15"></line>
          <rect className="ql-fill" height="1" rx="0.5" ry="0.5" width="7" x="2" y="14"></rect>
        </svg>
      </button>
    );
  }
}

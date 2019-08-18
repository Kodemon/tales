import { maybe } from "Engine/Utils";
import * as Quill from "quill";
import * as React from "react";
import { SettingGroup } from "../Styles";

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
      <React.Fragment>
        <div className="toolbar ql-toolbar ql-snow" style={{ marginBottom: 10 }}>
          <div className="ql-formats">
            {this.bold()}
            {this.italic()}
            {this.underline()}
          </div>
        </div>
        {this.header()}
        {this.size()}
        {this.align()}
      </React.Fragment>
    );
  }

  private header() {
    const value = maybe(this.state.format, "header", "normal");
    return (
      <SettingGroup>
        <label className="input">Header</label>
        <select
          value={value}
          onChange={e => {
            let val: number | boolean = false;
            if (e.target.value !== "normal") {
              val = parseInt(e.target.value, 10);
            }
            this.props.quill.format("header", val, "user");
          }}
        >
          <option value="1">Header 1</option>
          <option value="2">Header 2</option>
          <option value="3">Header 3</option>
          <option value="4">Header 4</option>
          <option value="5">Header 5</option>
          <option value="6">Header 6</option>
          <option value="normal">Normal</option>
        </select>
      </SettingGroup>
    );
  }

  private align() {
    const value = maybe(this.state.format, "align", "justify");
    return (
      <SettingGroup>
        <label className="input">Align</label>
        <select
          value={value}
          onChange={e => {
            this.props.quill.format("align", e.target.value, "user");
          }}
        >
          <option value="justify">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </SettingGroup>
    );
  }

  private size() {
    const value = maybe(this.state.format, "size", "normal");
    return (
      <SettingGroup>
        <label className="input">Size</label>
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
      </SettingGroup>
    );
  }

  private bold() {
    const isActive = maybe(this.state.format, "bold", false);
    return (
      <button
        className={`ql-bold${isActive && " ql-active"}`}
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
        className={`ql-italic${isActive && " ql-active"}`}
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
        className={`ql-underline${isActive && " ql-active"}`}
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
}

/*
<button
          className="ql-bold"
          onClick={() => {
            component.quill.format("header", 1, "user");
          }}
        >
          H1
        </button>

        <button
          className="ql-bold"
          onClick={() => {
            component.quill.format("bold", true, "user");
          }}
        >
          B
        </button>

        <select
          value={maybe(component.quill.getFormat(), "align", "justify")}
          onChange={e => {
            component.quill.format("align", e.target.value, "user");
          }}
        >
          <option value="justify">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
*/

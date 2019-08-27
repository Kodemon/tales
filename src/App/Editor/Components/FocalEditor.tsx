import * as React from "react";

export class FocalEditor extends React.Component<
  {
    src: string;
    focal: {
      x: number;
      y: number;
    };
    onChange: (x: number, y: number) => void;
  },
  {
    show: boolean;
  }
> {
  private editor: any;

  private edit: any;
  private view: any;

  constructor(props: any) {
    super(props);
    this.state = {
      show: false
    };
  }

  public componentDidMount() {
    this.editor = new Focuspoint.Edit(this.edit, {
      view_elm: this.view,
      x: this.props.focal.x,
      y: this.props.focal.y
    });
    this.editor.on("drag:end", this.props.onChange);
  }

  public componentWillUnmount() {
    this.editor.kill();
  }

  public render() {
    return (
      <div style={{ textAlign: "center" }}>
        <button style={{ margin: "10px 0" }} onClick={() => this.setState(() => ({ show: !this.state.show }))}>
          {this.state.show ? "Close" : "Open"} Focal Editor
        </button>
        <figure
          ref={c => (this.view = c)}
          className="lfy-focuspoint-view"
          id="view"
          style={{ backgroundImage: `url('${this.props.src}')`, height: this.state.show ? 380 : 0, overflow: "hidden" }}
        >
          <div ref={c => (this.edit = c)} className="lfy-focuspoint-edit" id="edit">
            <button
              className="lfy-focuspoint-button"
              style={{ background: "#777", border: "1px dashed #000", width: 20, height: 20, marginTop: -10, marginLeft: -10, opacity: 0.5 }}
              id="button"
            ></button>
          </div>
        </figure>
      </div>
    );
  }
}

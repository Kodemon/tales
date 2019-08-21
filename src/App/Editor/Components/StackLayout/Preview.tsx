import { Component } from "Engine/Component";
import * as React from "react";
import { clamp } from "./Parser/Types";
import { ComponentDetails, StyledHandler, StyledPreview, StyledTrack } from "./Styles";

export class Preview extends React.Component<
  {
    tpl: any;
    width: number;
    height: number;
    areas: any;
    setArea: any;
    components: Component[];
  },
  {
    isDragging: boolean;
    draggedArea?: string;
    draggedPosition?: string;
    activatedComponent?: string;
  }
> {
  private dx: number = 0;
  private dy: number = 0;
  private node: any;

  constructor(props: any) {
    super(props);
    this.state = {
      isDragging: false,
      draggedArea: undefined,
      draggedPosition: undefined,
      activatedComponent: undefined
    };
  }

  public componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);
    document.addEventListener("mousemove", this.handleMouseMove);
  }

  public componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("mousemove", this.handleMouseMove);
  }

  public handleMouseUp = (evt: any) => {
    if (this.state.isDragging) {
      this.setState(() => ({
        isDragging: false,
        draggedArea: undefined,
        draggedPosition: undefined
      }));
    }
  };

  public handleMouseMove = (evt: any) => {
    const { width, height } = this.props;
    const { isDragging, draggedArea, draggedPosition } = this.state;

    if (isDragging) {
      const rect = this.node.getBoundingClientRect();
      const x = Math.round(((evt.clientX - rect.left) / rect.width) * width);
      const y = Math.round(((evt.clientY - rect.top) / rect.height) * height);

      switch (true) {
        case typeof draggedPosition === "string":
          return this.moveHandler(x, y);
        case typeof draggedArea === "string":
          return this.moveTrack(x, y);
      }
    }
  };

  public makeTrackMouseDown = (draggedArea: any) => (evt: any) => {
    evt.preventDefault();

    const { width, height, areas } = this.props;
    const area = areas[draggedArea];
    const rect = this.node.getBoundingClientRect();

    const x = Math.round(((evt.clientX - rect.left) / rect.width) * width);
    const y = Math.round(((evt.clientY - rect.top) / rect.height) * height);

    this.dx = x - area.column.start + 1;
    this.dy = y - area.row.start + 1;

    this.setState(() => ({ isDragging: true, draggedArea }));
  };

  public makeHandlerMouseDown = (draggedArea: any) => (draggedPosition: any) => (evt: any) => {
    evt.preventDefault();
    this.setState(() => ({ isDragging: true, draggedArea, draggedPosition }));
  };

  public activateComponent = (area: string) => (evt: any) => {
    evt.preventDefault();
    this.setState(() => ({ activatedComponent: area }));
  };

  public moveTrack = (x: number, y: number) => {
    const { width, height, areas, setArea } = this.props;
    const { draggedArea } = this.state;
    let area = areas[0];
    if (draggedArea) {
      area = areas[draggedArea];
    }

    const top = this.findAdjacentArea("top", draggedArea);
    const right = this.findAdjacentArea("right", draggedArea);
    const bottom = this.findAdjacentArea("bottom", draggedArea);
    const left = this.findAdjacentArea("left", draggedArea);

    const columnStart = clamp(
      x - this.dx + 1,
      typeof left === "string" ? areas[left].column.end : 1,
      (typeof right === "string" ? areas[right].column.start : width + 1) - area.column.span
    );

    const rowStart = clamp(y - this.dy + 1, typeof top === "string" ? areas[top].row.end : 1, (typeof bottom === "string" ? areas[bottom].row.start : height + 1) - area.row.span);

    if (columnStart !== area.column.start || rowStart !== area.row.start) {
      const columnEnd = columnStart + area.column.span;
      const rowEnd = rowStart + area.row.span;

      return setArea(draggedArea, {
        column: {
          ...area.column,
          start: columnStart,
          end: columnEnd
        },
        row: {
          ...area.row,
          start: rowStart,
          end: rowEnd
        }
      });
    }
  };

  public moveHandler = (x: number, y: number) => {
    const { width, height, areas, setArea } = this.props;
    const { draggedPosition, draggedArea } = this.state;
    let area = areas[0];
    if (draggedArea) {
      area = areas[draggedArea];
    }
    const adj = this.findAdjacentArea(draggedPosition, draggedArea);

    if (draggedPosition === "top") {
      const start = clamp(y + 1, typeof adj === "string" ? areas[adj].row.end : 1, area.row.end - 1);

      return setArea(draggedArea, {
        ...area,
        row: {
          ...area.row,
          span: area.row.end - start,
          start
        }
      });
    }

    if (draggedPosition === "right") {
      const end = clamp(x + 1, area.column.start + 1, typeof adj === "string" ? areas[adj].column.start : width + 1);

      return setArea(draggedArea, {
        ...area,
        column: {
          ...area.column,
          span: end - area.column.start,
          end
        }
      });
    }

    if (draggedPosition === "bottom") {
      const end = clamp(y + 1, area.row.start + 1, typeof adj === "string" ? areas[adj].row.start : height + 1);

      return setArea(draggedArea, {
        ...area,
        row: {
          ...area.row,
          span: end - area.row.start,
          end
        }
      });
    }

    if (draggedPosition === "left") {
      const start = clamp(x + 1, typeof adj === "string" ? areas[adj].column.end : 1, area.column.end - 1);

      return setArea(draggedArea, {
        ...area,
        column: {
          ...area.column,
          span: area.column.end - start,
          start
        }
      });
    }
  };

  public findAdjacentArea = (direction: any, area: any) => {
    const { areas } = this.props;
    const { column, row } = areas[area];
    const keys = Object.keys(areas);

    if (direction === "top") {
      return keys.find(key => areas[key].row.end === row.start && areas[key].column.start < column.end && areas[key].column.end > column.start);
    }

    if (direction === "right") {
      return keys.find(key => areas[key].column.start === column.end && areas[key].row.start < row.end && areas[key].row.end > row.start);
    }

    if (direction === "bottom") {
      return keys.find(key => areas[key].row.start === row.end && areas[key].column.start < column.end && areas[key].column.end > column.start);
    }

    if (direction === "left") {
      return keys.find(key => areas[key].column.end === column.start && areas[key].row.start < row.end && areas[key].row.end > row.start);
    }
  };

  public renderComponent() {
    const component = this.props.components.find(f => f.id === this.state.activatedComponent);
    if (!component) {
      return null;
    }
    return (
      <div>
        <button onClick={() => this.setState(() => ({ activatedComponent: undefined }))}>
          <i className="fa fa-close" />
        </button>
        <div>{component.name}</div>
        <div>{component.id}</div>
      </div>
    );
  }

  public render() {
    const { tpl, width, height, areas, components } = this.props;
    const { activatedComponent, isDragging, draggedArea, draggedPosition } = this.state;

    // onClick={this.activateComponent(area)}

    return (
      <StyledPreview tpl={tpl} width={width} height={height} ref={e => (this.node = e)}>
        {Object.keys(areas).map(area => (
          <Track
            key={area}
            area={area}
            component={components.find(f => f.id === area)}
            column={areas[area].column}
            row={areas[area].row}
            grabbing={isDragging && draggedArea === area && typeof draggedPosition !== "string"}
            onMouseDown={this.makeTrackMouseDown(area)}
            onHandlerMouseDown={this.makeHandlerMouseDown(area)}
          />
        ))}
        {activatedComponent && this.renderComponent()}
      </StyledPreview>
    );
  }
}

function Track({
  area,
  column,
  row,
  component,
  grabbing,
  onMouseDown,
  onHandlerMouseDown,
  onClick
}: {
  area: string;
  column: string;
  row: string;
  component?: Component;
  grabbing: boolean;
  onMouseDown: any;
  onHandlerMouseDown: any;
  onClick?: any;
}) {
  return (
    <StyledTrack area={area} grabbing={grabbing} onMouseDown={onMouseDown} onClick={onClick}>
      <Handler position="top" onMouseDown={onHandlerMouseDown("top")} />
      <Handler position="right" onMouseDown={onHandlerMouseDown("right")} />
      <Handler position="bottom" onMouseDown={onHandlerMouseDown("bottom")} />
      <Handler position="left" onMouseDown={onHandlerMouseDown("left")} />
      {component && (
        <ComponentDetails>
          {component.name} - {component.id}
        </ComponentDetails>
      )}
    </StyledTrack>
  );
}

function Handler({ position, onMouseDown }: { onMouseDown: any; position: string }) {
  return <StyledHandler size="6px" position={position} onMouseDown={onMouseDown} />;
}

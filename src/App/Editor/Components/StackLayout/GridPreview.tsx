import * as React from "react";
import { StyledGrid, StyledGridLine, StyledGridText } from "./Styles";

export class GridPreview extends React.Component<{
  width: number;
  height: number;
  areas: any;
}> {
  public renderArea = (area: any) => {
    const { width, height, areas } = this.props;
    const { row, column } = areas[area];

    return Array.from({ length: row.span }, (_, r) =>
      Array.from({ length: column.span }, (_, c) => (
        <StyledGridText key={`area${r}${c}`} x={`${((column.start + c - 0.5) / width) * 100}%`} y={`${((row.start + r - 0.5) / height) * 100}%`}>
          {area}
        </StyledGridText>
      ))
    );
  };

  public renderCols = (_: any, index: number) => {
    const { width } = this.props;

    return <StyledGridLine key={index} x1={`${((index + 1) / width) * 100}%`} y1="0%" x2={`${((index + 1) / width) * 100}%`} y2="100%" />;
  };

  public renderRows = (_: any, index: number) => {
    const { height } = this.props;

    return <StyledGridLine key={index} x1="0%" y1={`${((index + 1) / height) * 100}%`} x2="100%" y2={`${((index + 1) / height) * 100}%`} />;
  };

  public render() {
    const { width, height, areas } = this.props;

    return (
      <StyledGrid>
        <g>{Object.keys(areas).map(this.renderArea)}</g>
        <g>{Array.from({ length: width - 1 }, this.renderCols)}</g>
        <g>{Array.from({ length: height - 1 }, this.renderRows)}</g>
      </StyledGrid>
    );
  }
}

import { Grid } from "./Types";

const find: Function = (fn: Function, direction: "row" | "column", extremum: "start" | "end", { areas }: Grid): number =>
  fn(...Object.keys(areas).map(cell => areas[cell][direction][extremum]));

export const minColumnStart: (grid: Grid) => number = (grid: Grid) => find(Math.min, "column", "start", grid);

export const maxColumnStart: (grid: Grid) => number = (grid: Grid) => find(Math.max, "column", "start", grid);

export const minRowStart: (grid: Grid) => number = (grid: Grid) => find(Math.min, "row", "start", grid);

export const maxRowStart: (grid: Grid) => number = (grid: Grid) => find(Math.max, "row", "start", grid);

export const minColumnEnd: (grid: Grid) => number = (grid: Grid) => find(Math.min, "column", "end", grid);

export const maxColumnEnd: (grid: Grid) => number = (grid: Grid) => find(Math.max, "column", "end", grid);

export const minRowEnd: (grid: Grid) => number = (grid: Grid) => find(Math.min, "row", "end", grid);

export const maxRowEnd: (grid: Grid) => number = (grid: Grid) => find(Math.max, "row", "end", grid);

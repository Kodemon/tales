export interface Track {
  start: number;
  end: number;
  span: number;
}

export interface Area {
  row: Track;
  column: Track;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Grid {
  width: number;
  height: number;
  areas: { [key: string]: Area };
}

export const track = (start: number = 1, end: number = 1): Track => ({ start, end, span: end - start });

export const area = ({ x = 0, y = 0, width = 0, height = 0 }: Rect): Area => ({
  column: track(x + 1, x + width + 1),
  row: track(y + 1, y + height + 1)
});

export const rect = ({ column = { start: 1, end: 1, span: 0 }, row = { start: 1, end: 1, span: 0 } }: Area): Rect => ({
  x: column.start - 1,
  y: row.start - 1,
  width: column.end - column.start,
  height: row.end - row.start
});

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function integer(value: string | number, previous: number, min: number, max: number) {
  const int = typeof value === "string" ? parseInt(value) : value;
  const safe = isNaN(int) ? previous : clamp(int, min, max);

  return safe;
}

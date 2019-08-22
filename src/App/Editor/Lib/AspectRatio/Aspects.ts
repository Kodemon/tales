export const aspectRatios = [
  {
    name: "instagram",
    ratio: [1, 1],
    description: "Square",
    decimal: 1
  },
  {
    name: "A4 paper",
    ratio: [1, 1.41],
    decimal: 1.41
  },
  {
    name: "Desktop",
    ratio: [16, 9],
    decimal: 1.77777,
    orientation: "landscape"
  },
  {
    name: "iPhone XR",
    ratio: [9, 19.5],
    decimal: 0.4615384615
  },
  {
    name: "iPad Pro",
    ratio: [4, 3],
    decimal: 1.3333333333
  }
];

export function parseRatio(aspectRatio: string) {
  return aspectRatios.find(f => f.name === aspectRatio);
}

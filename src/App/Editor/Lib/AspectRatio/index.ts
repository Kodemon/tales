import { parseRatio } from "./Aspects";

export const fitAspect = function(container: HTMLDivElement, aspectRatio: string): { width: number; height: number } {
  const actualWidth: number = container.clientWidth;
  const actualHeight: number = container.clientHeight;
  const aspect = parseRatio(aspectRatio);
  const result = fitBoth(actualWidth, actualHeight, aspect);
  return {
    width: (result.width / actualWidth) * 100,
    height: (result.height / actualHeight) * 100
  };
};

function fitHeight(actualWidth: number, actualHeight: number, aspect: any): { aspect: any; orientation: string; width: number; height: number } {
  const orientation = actualWidth > actualHeight ? "landscape" : "portrait";
  const decimal = orientation === "portrait" ? 1 / aspect.decimal : aspect.decimal;
  let height = actualWidth * decimal;
  height = Math.round(height);
  return {
    aspect,
    orientation,
    width: actualWidth,
    height
  };
}

function fitWidth(actualWidth: number, actualHeight: number, aspect: any): { aspect: any; orientation: string; width: number; height: number } {
  const orientation = actualWidth > actualHeight ? "landscape" : "portrait";
  const decimal = orientation === "portrait" ? 1 / aspect.decimal : aspect.decimal;
  let width = actualHeight * decimal;
  width = Math.round(width);
  return {
    aspect,
    orientation,
    width,
    height: actualHeight
  };
}

function fitBoth(actualWidth: number, actualHeight: number, aspect: any): { aspect: any; orientation: string; width: number; height: number } {
  const moveWidth = fitWidth(actualWidth, actualHeight, aspect);
  return moveWidth.width > actualWidth ? fitHeight(actualWidth, actualHeight, aspect) : moveWidth;
}

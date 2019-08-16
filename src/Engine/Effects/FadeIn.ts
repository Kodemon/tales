/*
import * as scrollama from "scrollama";
import { setStyle } from "../Utils";

const scroller = scrollama();
const elements: Set<any> = new Set();

export function fadeIn(element: any) {
  setStyle(element, {
    opacity: 0
  });
  elements.add(element);
}

export function loadFadeIn() {
  scroller
    .setup({
      step: Array.from(elements),
      progress: true
    })
    .onStepEnter((response: any) => {
      console.log("Enter: ", response);
    })
    .onStepProgress(({ element, index, progress }: any) => {
      setStyle(element, {
        opacity: progress
      });
    })
    .onStepExit((response: any) => {
      console.log("Exit: ", response);
    });
}
*/

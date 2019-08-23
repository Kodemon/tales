import * as React from "react";
import styled from "styled-components";
import { Color } from "../../../Variables";

export const Track = ({ source, target, getTrackProps, ...restProps }: { source: any; target: any; getTrackProps: any }) => (
  <TrackDiv source={source} target={target} {...restProps} {...getTrackProps()} />
);

const TrackDiv = styled.div<{ source: any; target: any }>`
  position: absolute;
  left: ${p => p.source.percent}%;
  z-index: 1;
  width: ${p => p.target.percent - p.source.percent}%;
  height: 6px;
  cursor: pointer;
  border: 0;
  border-radius: 0;
  background-color: ${Color.BackgroundBlue};
`;

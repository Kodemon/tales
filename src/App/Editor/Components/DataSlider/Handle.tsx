import * as React from "react";
import styled from "styled-components";
import { Color } from "../../../Variables";

export const Handle = ({
  domain: [min, max],
  handle: { id, value, percent },
  getHandleProps,
  ...restProps
}: {
  domain: number[];
  handle: { id: any; value: any; percent: any };
  getHandleProps: any;
  onFocus?: any;
  onBlur?: any;
}) => <HandleButton role="slider" aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} percent={percent} {...restProps} {...getHandleProps(id)} />;

const HandleButton = styled.button<{ percent: any }>`
  position: absolute;
  left: ${p => p.percent}%;
  margin-left: -4px;
  margin-top: -3px;
  padding: 0 !important;
  z-index: 2;
  width: 12px;
  height: 12px;
  cursor: pointer;
  border: 0;
  border-radius: 50%;
  box-shadow: 0px 2px 3px ${Color.Background};
  background-color: #fff;
  border: 1px solid #cbcbcb;
  transition: box-shadow 0.2s ease;
  &:focus,
  &:active,
  &:hover {
    outline: 0;
    box-shadow: 0px 1px 2px ${Color.Background};
  }
`;

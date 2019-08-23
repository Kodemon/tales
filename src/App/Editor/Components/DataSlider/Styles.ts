import { Slider as CSlider } from "react-compound-slider";
import styled from "styled-components";
import { Color } from "../../../Variables";

export const Container = styled.div`
  height: 12px;
  padding-top: 6px;
  width: 100%;
`;

export const Slider = styled(CSlider)`
  position: relative;
  width: 100%;
`;

export const Rail = styled.div`
  position: absolute;
  width: 100%;
  height: 6px;
  border-radius: 0;
  cursor: pointer;
  background-color: ${Color.BackgroundDark};
`;

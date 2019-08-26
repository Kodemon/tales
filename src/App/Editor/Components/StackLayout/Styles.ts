import { darken, lighten, transparentize } from "polished";
import styled from "styled-components";
import { Color } from "../../../Variables";

export const colors = {
  primary: "#222",
  secondary: "#333"
};

export const Container = styled.div`
  width: 100%;
  height: auto;
  padding: 12px 0 0;
`;

export const StyledSidebar = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: sidebar;
  overflow: hidden;
`;

export const StyledMain = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: main;
`;

export const MainInner = styled.div`
  flex: 1;
  position: relative;
  height: 160px;
`;

export const SvgGrid = styled.svg`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px solid ${Color.BorderLight};
`;

export const SvgText = styled.text`
  font-family: "Roboto Mono", monospace;
  font-weight: 500;
  font-size: 1rem;
  text-anchor: middle;
  vertical-align: middle;
  fill: ${transparentize(0.75, colors.secondary)};
`;

export const SvgLine = styled.line`
  stroke: ${Color.BorderLight};
  stroke-width: 1px;
`;

export const StyledPreview = styled.div<{ width: number; height: number; tpl: string }>`
  z-index: 5;
  position: relative;
  display: grid;
  grid-template-columns: repeat(${props => props.width}, 1fr);
  grid-template-rows: repeat(${props => props.height}, 1fr);
  grid-template-areas: ${props => props.tpl};
  width: 100%;
  height: 100%;
`;

export const StyledTrack = styled.div<{ area: string; grabbing?: boolean; isActive: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  grid-area: ${props => props.area};
  cursor: ${props => (props.grabbing ? "grabbing" : "grab")};
  background: ${({ isActive }) => (isActive ? Color.BackgroundBlue : Color.BackgroundDark)};
  color: ${({ isActive }) => (isActive ? Color.FontLight : Color.Font)};
`;

export const StyledHandler = styled.div<{ position: string; size: string; isActive: boolean }>`
  position: absolute;
  top: ${({ position }) => (position === "bottom" ? "auto" : 0)};
  right: ${({ position }) => (position === "left" ? "auto" : 0)};
  bottom: ${({ position }) => (position === "top" ? "auto" : 0)};
  left: ${({ position }) => (position === "right" ? "auto" : 0)};
  width: ${({ position, size }) => (position === "left" || position === "right" ? size : "100%")};
  height: ${({ position, size }) => (position === "top" || position === "bottom" ? size : "100%")};
  cursor: ${({ position }) => (position === "left" || position === "right" ? "col-resize" : "row-resize")};
  background: ${({ isActive }) => (isActive ? "blue" : "grey")};
  ${({ isActive }) =>
    isActive
      ? `
  background: ${Color.BorderLightBlue};
  `
      : `
  background: ${Color.Border};
`}
`;

export const StyledHint = styled.div`
  padding: 2rem;
`;

export const StyledHintTitle = styled.h1`
  padding-bottom: 1rem;
  font-weight: 500;
  font-size: 1.5rem;
  color: ${colors.secondary};
`;

export const Hint = styled.div`
  line-height: 1.6;
  font-size: 10px;
  color: ${lighten(0.6, colors.primary)};
`;

export const StyledTemplate = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px;
`;

export const StyledTemplateTitle = styled.h2`
  padding-bottom: 1.5rem;
  text-transform: uppercase;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${colors.secondary};
  letter-spacing: 0.1rem;
`;

export const StyledTemplateControl = styled.div`
  flex: 1;
`;

export const TemplateInput = styled.textarea`
  width: 100%;
  height: 100%;
  padding: 12px;
  border-radius: 2px;
  border: none;
  resize: none;
  line-height: 1.5;
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
  color: #333;
  background: #eee;
  transition: background 0.2s;
  &:focus {
    outline: 0;
    background: #fff;
  }
`;

export const Settings = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 8px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    display: block;
    height: 1px;
    background: ${colors.primary};
  }
`;

export const SettingDivider = styled.div`
  text-align: center;
  font-family: "Roboto Mono";
  font-weight: 500;
  font-size: 1.05rem;
  color: ${lighten(0.05, colors.primary)};
`;

export const SettingInput = styled.input`
  width: 4rem;
  padding: 0.4rem 0.6rem;
  margin: 0 0.75rem;
  border: none;
  border-radius: 2px;
  text-align: center;
  font-family: "Roboto Mono";
  font-size: 12px;
  color: #333;
  background: #eee;
  transition: background 0.2s;
  &:focus {
    outline: 0;
    background: #fff;
  }
`;

export const ComponentDetails = styled.div`
  font-family: "Roboto Mono", monospace;
  font-weight: 500;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ActionGroup = styled.div`
  display: flex;
  height: 32px;
  padding: 4px;
  width: 160px;
  justify-content: space-evenly;
  align-content: space-between;
`;

export const ActionButton = styled.button`
  background: none;
  border-radius: 24px;
  width: 50px;
  height: 24px;
  padding: 0 !important;
`;

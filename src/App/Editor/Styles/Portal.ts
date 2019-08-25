import styled from "styled-components";

import { Color, Font } from "../../Variables";

/*
 |--------------------------------------------------------------------------------
 | Portal Styled
 |--------------------------------------------------------------------------------
 */

export const Portal = styled.div`
  display: grid;
  grid-template-columns: 2fr 4fr;

  position: fixed;
  top: 0;
  left: 0;

  background: ${Color.BackgroundDark};
  width: 100vw;
  height: 100vh;

  font-family: ${Font.Family};
`;

/*
 |--------------------------------------------------------------------------------
 | Portal Menu Styled
 |--------------------------------------------------------------------------------
 */

export const PortalMenu = styled.div`
  display: grid;
  grid-template-columns: auto 200px;
  grid-template-areas: ". content";

  background: ${Color.Background};
  font-family: ${Font.FamilyRobotoCondensed};
`;

export const PortalMenuContent = styled.div`
  grid-area: content;

  padding: 40px 20px;
  min-height: 100vh;
  width: 100%;
`;

export const PortalMenuHeader = styled.div`
  color: ${Color.FontDark};
  font-weight: bold;
  font-size: 11px;
  text-transform: uppercase;
  margin-bottom: 6px;
  padding: 6px 10px;
`;

export const PortalMenuItem = styled.div<{ active?: boolean; blue?: boolean; noHover?: boolean }>`
  background: ${props => (props.active ? Color.BackgroundLight : "none")};
  border-radius: 3px;
  color: ${props => (props.blue ? Color.FontBlue : Color.FontLight)};
  margin: 3px 0;
  padding: 6px 10px;

  &:hover {
    background: ${props => (!props.noHover ? Color.BackgroundLightHover : "none")};
    color: ${props => (props.blue ? Color.FontBlueHover : Color.FontLight)};
    cursor: pointer;
  }
`;

export const PortalMenuDivider = styled.div`
  clear: both;
  height: 1px;
  line-height: 0;
  font-size: 0;
  border-top: 1px solid ${Color.BorderLight};
  margin: 4px 0;
`;

/*
 |--------------------------------------------------------------------------------
 | Portal Content Styled
 |--------------------------------------------------------------------------------
 */

export const PortalContent = styled.div`
  padding: 40px;
`;

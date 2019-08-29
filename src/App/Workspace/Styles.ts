import { lighten, transparentize } from "polished";
import styled from "styled-components";
import { Color } from "../Variables";

export const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  min-width: 100%;
  min-height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
`;

export const WelcomePage = styled.div`
  width: 90%;
  max-width: 1200px;
  font-size: 12px;
`;

export const Title = styled.div`
  margin-top: 1em;
  margin-bottom: 1em;
  flex: 1 100%;
`;

export const Heading = styled.h1`
  color: #616161;
  padding: 0;
  margin: 0;
  border: none;
  font-weight: 400;
  font-size: 3.6em;
  white-space: nowrap;
`;
export const Subtitle = styled.p`
  margin-top: 0.8em;
  font-size: 2.6em;
  display: block;
  color: #717171;
`;

export const Row = styled.div`
  display: flex;
  flex-flow: row;
`;
export const Splash = styled.div`
  flex: 1 1 0;
`;
export const Commands = styled.div`
  flex: 1 1 0;
`;

export const Section = styled.section`
  margin-bottom: 5em;
`;

export const Header = styled.h2`
  color: #616161;
  font-weight: 200;
  margin-top: 1.7em;
  margin-bottom: 5px;
  font-size: 19px;
  line-height: normal;
`;

export const Link = styled.button`
  color: #006ab1;
  text-decoration: none;
  border: 0;
  cursor: pointer;
`;

export const NavDetail = styled.span`
  padding-left: 1em;
  color: #717171;
`;

export const Nav = styled.ul`
  margin: 0;
  font-size: 1.3em;
  list-style: none;
  padding: 0;
`;

export const NavItem = styled.li`
  list-style: none;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NavItemLoader = styled.li`
  list-style: none;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: ${transparentize(0.9, Color.BackgroundDisabled)};
  width: 200px;
  height: 18px;
  margin: 5px 0;
  &:first-child {
    width: 400px;
  }
  &:last-child {
    width: 300px;
  }
  animation-name: color;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  @keyframes color {
    0% {
      background-color: ${transparentize(0.97, Color.BackgroundDisabled)};
    }
    50% {
      background-color: ${transparentize(0.92, Color.BackgroundDisabled)};
    }
    100% {
      background-color: ${transparentize(0.97, Color.BackgroundDisabled)};
    }
  }
`;

export const BlockItem = styled.button`
  background: rgba(0, 0, 0, 0.04);
  border: none;
  margin: 7px 0;
  padding: 12px 10px;
  width: calc(100% - 2px);
  height: 5em;
  font-size: 1.3em;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
`;
export const BlockTitle = styled.h3`
  font-weight: 400;
  font-size: 1em;
  margin: 0;
  margin-bottom: 0.25em;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #616161;
`;
export const BlockDetail = styled.span`
  display: inline-block;
  width: 100%;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #717171;
`;

export const NavDivider = styled.li`
  border: 1px solid rgba(0, 0, 0, 0.04);
  width: 200px;
  margin: 2em 0 1em;
`;

export const GitHubLink = styled.a`
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 1px solid #0000;
  border-radius: 4px;
  text-decoration: none;
  padding: 10px 16px;
  font-size: 18px;
  line-height: 1.3333333;
  border-radius: 6px;

  position: relative;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  color: #fff;
  background-color: #444;
  border-color: #0003;
  i {
    padding-right: 12px;
  }
  &:hover {
    color: #fff;
    background-color: #2b2b2b;
    border-color: #0003;
  }
  &:hover,
  &:focus {
    text-decoration: none;
  }
`;

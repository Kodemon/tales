import styled from "styled-components";

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
  font-size: 10px;
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

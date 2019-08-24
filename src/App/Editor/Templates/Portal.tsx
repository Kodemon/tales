import * as React from "react";
import styled from "styled-components";

import { Source } from 'Engine/Enums';
import { Page } from 'Engine/Page';

import { Color, Font } from '../../Variables';
import { templates } from "./";

export class TemplatePortal extends React.Component<{
  page: Page;
  close: () => void;
}> {
  public render() {
    return (
      <Portal>
        <PortalMenu>
          <PortalMenuContent>
            <PortalMenuHeader>Section Templates</PortalMenuHeader>
            <PortalMenuItem active={true}>General</PortalMenuItem>
          </PortalMenuContent>
        </PortalMenu>
        <PortalContent>
          <Templates>
            <TemplateCard key="blank" onClick={() => {
              this.props.page.addSection({}, Source.User);
              this.props.close();
            }}>
              Blank Section
                </TemplateCard>
            {
              templates.map(template => (
                <TemplateCard key={template.name} onClick={() => {
                  this.props.page.addSection(template.layout(), Source.User);
                  this.props.close();
                }}>
                  {template.name}
                </TemplateCard>
              ))
            }
          </Templates>
        </PortalContent>
      </Portal>
    )
  }
}

/*
 |--------------------------------------------------------------------------------
 | Portal Styled
 |--------------------------------------------------------------------------------
 */

const Portal = styled.div`
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

const PortalMenu = styled.div`
  display:grid;
  grid-template-columns: auto 200px;
  grid-template-areas: ". content";

  background: ${Color.Background};
`;

const PortalMenuContent = styled.div`
  grid-area: content;

  padding: 40px 20px;
  min-height: 100vh;
  width: 100%;
`;

const PortalMenuHeader = styled.div`
  color: ${Color.FontDark};
  font-weight: bold;
  font-size: 11px;
  text-transform: uppercase;
  margin-bottom: 6px;
  padding: 6px 10px;
`;

const PortalMenuItem = styled.div<{ active?: boolean }>`
  background: ${Color.BackgroundLight};
  border-radius: 3px;
  color: ${Color.FontLight};
  padding: 6px 10px;

  &:hover {
    background: ${Color.BackgroundLightHover};
    cursor: pointer;
  }
`;

/*
 |--------------------------------------------------------------------------------
 | Portal Content Styled
 |--------------------------------------------------------------------------------
 */

const PortalContent = styled.div`
  padding: 40px;
`;

/*
 |--------------------------------------------------------------------------------
 | Template Styled
 |--------------------------------------------------------------------------------
 */

const Templates = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;

  max-width: 560px;
  width: 100%;
`;

const TemplateCard = styled.div`
  background: ${Color.BackgroundLight};
  border-radius: 3px;
  color: ${Color.FontLight};
  padding: 10px;

  text-align: center;

  &:hover {
    background: ${Color.BackgroundLightHover};
    cursor: pointer;
  }
`;

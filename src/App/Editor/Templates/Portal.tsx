import * as React from "react";
import styled from "styled-components";

import { Source } from "Engine/Enums";
import { Page } from "Engine/Page";

import { Color } from "../../Variables";
import { Portal, PortalContent, PortalMenu, PortalMenuContent, PortalMenuDivider, PortalMenuHeader, PortalMenuItem } from "../Styles/Portal";
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
            <PortalMenuDivider />
            <PortalMenuItem blue={true} noHover={true} onClick={this.props.close}>
              Close
            </PortalMenuItem>
          </PortalMenuContent>
        </PortalMenu>
        <PortalContent>
          <Templates>
            <TemplateCard
              key="blank"
              onClick={() => {
                this.props.page.addSection({}, Source.User);
                this.props.close();
              }}
            >
              Blank Section
            </TemplateCard>
            {templates.map(template => (
              <TemplateCard
                key={template.name}
                onClick={() => {
                  this.props.page.addSection(template.layout(), Source.User);
                  this.props.close();
                }}
              >
                {template.name}
              </TemplateCard>
            ))}
          </Templates>
        </PortalContent>
      </Portal>
    );
  }
}

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

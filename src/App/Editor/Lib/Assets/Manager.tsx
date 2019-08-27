import * as React from "react";
import styled from "styled-components";

import { Page } from "Engine/Page";

import { AssetItem } from "./Item";

export class AssetManager extends React.Component<{
  page: Page;
}> {
  public render() {
    return (
      <Assets>
        {this.props.page.assets.map(asset => (
          <AssetItem key={asset.public_id} page={this.props.page} asset={asset} />
        ))}
      </Assets>
    );
  }
}

/*
 |--------------------------------------------------------------------------------
 | Styles
 |--------------------------------------------------------------------------------
 */

const Assets = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 8px;
`;

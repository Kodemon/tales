import * as React from "react";
import styled from "styled-components";

import { Source } from "Engine/Enums";
import { Page } from "Engine/Page";

import { Color, Font } from "../../../Variables";
import { deleteResource } from "./Providers/Cloudinary";

export class AssetItem extends React.Component<{ page: Page; asset: any }> {
  public render() {
    const { page, asset } = this.props;
    return (
      <Asset key={asset.public_id}>
        <AssetImage>
          <img src={asset.secure_url} />
        </AssetImage>
        <AssetMeta>
          <i className="fa fa-cog" />
          <i
            className="fa fa-trash delete"
            onClick={() => {
              if (confirm("This resource will be permanently deleted, are you sure?")) {
                deleteResource(asset.public_id)
                  .then((res: any) => {
                    if (res.status === 200) {
                      page.removeAsset(asset.public_id, Source.User);
                    }
                  })
                  .catch((err: Error) => {
                    console.log(err);
                  });
              }
            }}
          />
        </AssetMeta>
      </Asset>
    );
  }
}

/*
 |--------------------------------------------------------------------------------
 | Styles
 |--------------------------------------------------------------------------------
 */

const Asset = styled.div`
  position: relative;
  background: ${Color.BackgroundDark};
`;

const AssetImage = styled.div`
  height: 87px;
  > img {
    object-fit: cover;
    object-position: top center;
    width: 100%;
    height: 100%;
  }
`;

const AssetMeta = styled.div`
  position: absolute;
  bottom: 0;

  background: rgba(0, 0, 0, 0.65);
  font-family: ${Font.Family};
  font-size: ${Font.Size};
  color: ${Color.Font};
  padding: 5px 8px;
  width: 100%;

  clear: both;
  overflow: auto;

  > i {
    cursor: pointer;
    float: left;
    font-size: 14px;
    &:hover {
      color: ${Color.FontLight};
    }
  }

  > span {
    margin-left: 5px;
  }

  .delete {
    float: right;
  }
`;

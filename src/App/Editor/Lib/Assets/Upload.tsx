import * as React from "react";
import styled from "styled-components";

import { Source } from "Engine/Enums";
import { Page } from "Engine/Page";

import { Color } from "../../../Variables";
import { uploadResource } from "./Providers/Cloudinary";

export class AssetUpload extends React.Component<{
  page: Page;
}> {
  private input: any;

  private click = () => {
    this.input.click();
  };

  private fileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (const file of Array.from(files)) {
        uploadResource(
          file,
          {
            folder: `page:${this.props.page.id}`,
            tags: `tails,page,${this.props.page.id}`
          },
          {
            onUploadProgress: (progressEvent: any) => {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              console.log(percent);
            }
          }
        )
          .then((res: any) => {
            if (res.status === 200) {
              this.props.page.addAsset(res.data, Source.User);
            }
          })
          .catch((err: any) => {
            console.log(err);
          });
      }
    }
  };

  public render() {
    return (
      <React.Fragment>
        <input type="file" ref={c => (this.input = c)} onChange={this.fileUpload} multiple={true} hidden={true} />
        <Button type="button" onClick={this.click}>
          <i className="fa fa-cloud-upload" /> Upload
        </Button>
      </React.Fragment>
    );
  }
}

/*
 |--------------------------------------------------------------------------------
 | Styles
 |--------------------------------------------------------------------------------
 */

const Button = styled.button`
  position: absolute;
  top: 5px;
  right: 10px;

  background: ${Color.BackgroundLight};
  border: 1px solid ${Color.Border} !important;
  color: ${Color.FontLight};
  font-size: 12px;
  padding: 8px 10px;

  cursor: pointer;

  > i {
    color: ${Color.FontLight};
    font-size: 13px;
  }

  &:hover {
    background: ${Color.BackgroundLightHover};
  }
`;

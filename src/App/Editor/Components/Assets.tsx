import * as axios from "axios";
import * as crypto from "crypto-js";
import * as React from "react";
import styled from "styled-components";

import { Page } from "Engine/Page";

import { Color } from "../../Variables";

const API_KEY = "326518456961523";
const API_SECRET = "WdcDmJ0uoluH6nLa1T9g6GGqN9I";
const ACCOUNT = "kodemon";

/*
 |--------------------------------------------------------------------------------
 | File Uploader
 |--------------------------------------------------------------------------------
 */

export class FileUpload extends React.Component<{
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
        const payload = {
          timestamp: (Date.now() / 1000) | 0,
          upload_preset: "tails",
          folder: `page:${this.props.page.id}`,
          tags: `tails,page,${this.props.page.id}`
        };
        upload(
          `https://api.cloudinary.com/v1_1/${ACCOUNT}/upload`,
          {
            ...payload,
            file,
            api_key: API_KEY,
            signature: generateSignature(payload, API_SECRET)
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
              const cache = localStorage.getItem(`page:${this.props.page.id}:assets`);
              const assets = cache ? JSON.parse(cache) : [];
              assets.push(res.data);
              localStorage.setItem(`page:${this.props.page.id}:assets`, JSON.stringify(assets));
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
 | Utilities
 |--------------------------------------------------------------------------------
 */

export function getAssets(page: string): any[] {
  const cache = localStorage.getItem(`page:${page}:assets`);
  return cache ? JSON.parse(cache) : [];
}

/**
 * Uploads a file.
 *
 * @param uri
 * @param data
 * @param config
 *
 * @returns axios post promise
 */
function upload(uri: string, data: any, config?: any) {
  const formData = new FormData();
  if (!data.file || !(data.file instanceof File)) {
    throw new Error("Missing 'file' assignment in file upload request.");
  }
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return axios.post(uri, formData, config);
}

/**
 * Generate a cloudinary signature.
 *
 * @param params
 * @param secret
 */
function generateSignature(params: any, secret: string) {
  const arr: string[] = [];
  Object.keys(params)
    .sort()
    .forEach(key => {
      arr.push(`${key}=${params[key]}`);
    });
  return crypto.SHA1(`${arr.join("&")}${secret}`).toString();
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

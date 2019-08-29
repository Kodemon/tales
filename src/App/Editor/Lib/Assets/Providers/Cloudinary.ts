import * as axios from "axios";
import { config } from "Config";
import * as crypto from "crypto-js";

/*
 |--------------------------------------------------------------------------------
 | Cloudinary Methods
 |--------------------------------------------------------------------------------
 */

export function uploadResource(file: File, data: any, options?: any) {
  const payload = {
    timestamp: (Date.now() / 1000) | 0,
    upload_preset: "tails",
    ...data
  };
  return axios.post(
    `https://api.cloudinary.com/v1_1/${config.cloudinary.account}/upload`,
    getFormData({
      ...payload,
      file,
      api_key: config.cloudinary.key,
      signature: generateSignature(payload, config.cloudinary.secret)
    }),
    options
  );
}

export function deleteResource(publicId: string, options?: any) {
  const payload = {
    timestamp: (Date.now() / 1000) | 0,
    public_id: publicId
  };
  return axios.post(
    `https://api.cloudinary.com/v1_1/${config.cloudinary.account}/image/destroy`,
    getFormData({
      ...payload,
      api_key: config.cloudinary.key,
      signature: generateSignature(payload, config.cloudinary.secret)
    }),
    options
  );
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function getFormData(data: any) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return formData;
}

/**
 * Generate a cloudinary POST request signature.
 *
 * @example
 *
 * generateSignature({
 *   public_id: "ManuallyGeneratedPublicId",
 *   tags: "foo,bar"
 * }, "API_SECRET")
 *
 * @param params Parameters to be signed.
 * @param secret Cloudinary API_SECRET
 */
export function generateSignature(params: any, secret: string) {
  const arr: string[] = [];
  Object.keys(params)
    .sort()
    .forEach(key => {
      arr.push(`${key}=${params[key]}`);
    });
  return crypto.SHA1(`${arr.join("&")}${secret}`).toString();
}

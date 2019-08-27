import * as axios from "axios";
import * as crypto from "crypto-js";

const API_KEY = "326518456961523";
const API_SECRET = "WdcDmJ0uoluH6nLa1T9g6GGqN9I";
const ACCOUNT = "kodemon";

/*
 |--------------------------------------------------------------------------------
 | Cloudinary Methods
 |--------------------------------------------------------------------------------
 */

export function uploadResource(file: File, data: any, config?: any) {
  const payload = {
    timestamp: (Date.now() / 1000) | 0,
    upload_preset: "tails",
    ...data
  };
  return axios.post(
    `https://api.cloudinary.com/v1_1/${ACCOUNT}/upload`,
    getFormData({
      ...payload,
      file,
      api_key: API_KEY,
      signature: generateSignature(payload, API_SECRET)
    }),
    config
  );
}

export function deleteResource(publicId: string, config?: any) {
  const payload = {
    timestamp: (Date.now() / 1000) | 0,
    public_id: publicId
  };
  return axios.post(
    `https://api.cloudinary.com/v1_1/${ACCOUNT}/image/destroy`,
    getFormData({
      ...payload,
      api_key: API_KEY,
      signature: generateSignature(payload, API_SECRET)
    }),
    config
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

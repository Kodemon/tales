import { APIGatewayEvent, Context } from "aws-lambda";
import * as https from "https";
import { URL } from "url";
import { generateErrorObject } from "./Lib/Errors";
import { createRepo } from "./Services/Git";

const CLIENT_ID = `86b25ee3cc91b93ee2db`;
const CLIENT_SECRET = `14f5eba1468bc0ec8105d3885d1198a44487275f`;
const OAUTH_CALLBACK_URL = "http://localhost:3000";

function extractCode(event) {
  const queryStringParameters = event.queryStringParameters || {};
  return queryStringParameters.code;
}

async function exchangeCodeForToken(code) {
  const api = new URL("/login/oauth/access_token", "https://github.com");
  api.searchParams.set("client_id", CLIENT_ID);
  api.searchParams.set("client_secret", CLIENT_SECRET);
  api.searchParams.set("code", code);
  return asyncHttpsPostRequest(api);
}

async function asyncHttpsPostRequest(url) {
  return new Promise(function(resolve, reject) {
    https
      .request(
        {
          method: "POST",
          host: url.host,
          path: url.pathname + url.search,
          headers: {
            Accept: "application/json"
          }
        },
        resp => {
          let data = "";
          resp.on("data", chunk => {
            data += chunk;
          });
          resp.on("end", () => {
            try {
              const parsed = JSON.parse(data);
              resolve(parsed);
            } catch (e) {
              reject(data);
            }
          });
        }
      )
      .on("error", reject)
      .end();
  });
}

export async function handler(event: APIGatewayEvent, context: Context) {
  const code = extractCode(event);

  if (!code) {
    return generateErrorObject("did not get expected query string named [code]");
  }

  let response;
  try {
    response = await exchangeCodeForToken(code);
  } catch (e) {
    return generateErrorObject("Failed to exchange code for access_token");
  }

  if (!response || !response.access_token) {
    return generateErrorObject("did not receive expected [access_token]");
  }

  return {
    statusCode: 302,
    headers: {
      Location: `${OAUTH_CALLBACK_URL}?access_token=${response.access_token}`
    },
    body: ""
  };
}

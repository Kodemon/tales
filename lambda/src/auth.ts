import { APIGatewayEvent, Context } from "aws-lambda";
import { generateErrorObject } from "./Lib/Errors";

const CLIENT_ID = `86b25ee3cc91b93ee2db`;
const scope = "user:email,repo";
const allowSignup = "true";
const authorizationUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${scope}&allow_signup=${allowSignup}`;

export async function handler(event: APIGatewayEvent, context: Context) {
  return {
    statusCode: 302,
    headers: {
      Location: authorizationUrl
    },
    body: null
  };
}

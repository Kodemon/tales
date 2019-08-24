import { APIGatewayEvent, Context } from "aws-lambda";
import { Db } from "mongodb";
import { config } from "./Config";
import { mongodb } from "./Services/Mongo";
import { sendMessage } from "./Services/Slack";

let db: Db = null;

export async function handler(event: APIGatewayEvent, context: Context) {
  try {
    console.log("connect to mongo");
    if (!db) {
      db = await mongodb();
    }
    await db.collection("pages").createIndex({ id: 1 }, { unique: true });
    await sendMessage("testing slack", config.slack.channels.info);
    //  const page = await db.collection("pages").insertOne({ id: 1, title: "frank", timestamp: new Date() });
    return {
      statusCode: 200,
      body: config.app.name
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: "bad bad leroy brown"
    };
  }
}

//   console.log("connect to mongo");
//   const db = await mongodb();
//   await db.collection("pages").createIndex({ id: 1 }, { unique: true });
//   try {
//     const page = await db.collection("pages").insertOne({ id: 1, title: "frank", timestamp: new Date() });
//     await sendMessage("testing slack", config.slack.channels.info);
//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         msg: "Hello, World! " + Math.round(Math.random() * 10),
//         ...obj
//       })
//     };
//   } catch (err) {
//     return {
//       statusCode: 400,
//       body: "bad bad leroy brown"
//     };
//   }
// }

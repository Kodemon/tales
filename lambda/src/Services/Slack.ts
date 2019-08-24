import axios from "axios";

import { config } from "../Config";
import { error } from "../Lib/Errors";

/**
 * Sends a message to slack, by default the message is sent to the
 * error channel.
 *
 * @example
 *
 * await sendMessage("Hello World!", config.slack.channels.system);
 * await sendMessage({ hello: "world" });
 *
 * @param message
 * @param channel
 * @param icon
 */
export async function sendMessage(message: string | any, channel: string = config.slack.channels.info, icon?: string): Promise<void> {
  const env = (process.env.NODE_ENV || "unset-env").toUpperCase();
  const text = typeof message === "string" ? message : JSON.stringify(message, null, 2);
  try {
    await axios.post(
      channel,
      {
        text: `${env}\n${text}`,
        icon_emoji: icon || ""
      },
      {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    throw error.axios(err);
  }
}

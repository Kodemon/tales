export const config = {
  /*
   |--------------------------------------------------------------------------------
   | Application
   |--------------------------------------------------------------------------------
   |
   | Stores the application/product name, and the front end application endpoint.
   |
   */

  app: {
    name: "Tales",
    uri: "http://localhost:3000"
  },

  /*
   |--------------------------------------------------------------------------------
   | MongoDB
   |--------------------------------------------------------------------------------
   */

  mongodb: {
    name: "eco",
    url: "mongodb+srv://cmdo:rollingstone@ecocluster0-ny5em.mongodb.net/test?retryWrites=true&w=majority"
  },

  /*
   |--------------------------------------------------------------------------------
   | Slack
   |--------------------------------------------------------------------------------
   */

  slack: {
    channels: {
      info: "https://hooks.slack.com/services/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"
    }
  }
};

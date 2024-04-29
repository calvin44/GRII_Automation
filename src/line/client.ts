import { messagingApi } from "@line/bot-sdk";

const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN ?? ""
})

export { client }


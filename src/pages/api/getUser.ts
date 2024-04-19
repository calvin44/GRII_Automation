import type { NextApiRequest, NextApiResponse } from "next"
import { messagingApi, WebhookRequestBody } from "@line/bot-sdk"

type Data = {
  message: string
}

// create LINE SDK config from env variables
const config = {
  channelSecret: process.env.CHANNEL_SECRET ?? "",
}

// create LINE SDK client
const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN ?? ""
})


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message: "Only POST method allowed" })

    const { events } = req.body as WebhookRequestBody
    const event = events[0]

    if (event.source.type === "group") {
      await client.pushMessage({ to: event.source.groupId!, messages: [{ type: "text", text: generateIdInfoMessage(event.source.groupId, "group") }] })
    }

    if (event.source.type === "user") {
      await client.pushMessage({ to: event.source.userId!, messages: [{ type: "text", text: generateIdInfoMessage(event.source.userId, "user") }] })
    }

    res.status(200).end()
  } catch (err) {
    console.error(err)
  }
}

function generateIdInfoMessage(id: string, type: string) {
  return `Your API ${type}ID is: ${id}`
}
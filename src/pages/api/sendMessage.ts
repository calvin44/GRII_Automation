import type { NextApiRequest, NextApiResponse } from "next"
import { messagingApi } from "@line/bot-sdk"

interface ResponseData {
  message: string
}

interface RequestBody {
  userOrGroupId: string
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
  res: NextApiResponse<ResponseData>,
) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message: "Only POST method allowed" })

    const { userOrGroupId, message } = req.body as RequestBody
    await client.pushMessage({ to: userOrGroupId, messages: [{ type: "text", text: message }] })
    res.status(200).json({ message: "Message sent!" })
  } catch (err) {
    res.status(500).json({ message: "Somethng went wrong" })
  }
}

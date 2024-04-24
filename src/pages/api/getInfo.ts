import type { NextApiRequest, NextApiResponse } from "next"
import { messagingApi, WebhookEvent, WebhookRequestBody } from "@line/bot-sdk"
import { customPostRequest } from "@/utils/customFetch"

interface Response {
  message?: string
  error?: string
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
  res: NextApiResponse<Response>,
) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message: "Only POST method allowed" })

    const { events } = req.body as WebhookRequestBody
    const event = events[0]

    // validate Event Source structure
    if (!event || !event.source || !event.source.type) {
      console.error("Invalid event structure:", event);
      res.status(400).json({ error: "Bad Request", message: "Invalid event structure" });
      return
    }

    // validate token
    if (!process.env.CHANNEL_SECRET || !process.env.CHANNEL_ACCESS_TOKEN) {
      console.error("Missing required environment variables")
      res.status(500).json({ error: "Internal Server Error", message: "Missing required environment variables" })
      return
    }
    // Get sticker info
    const stickerInfo = getStickerInfo(event)
    switch (event.source.type) {
      case "group":
        await client.pushMessage({
          to: event.source.groupId!, messages: [{
            type: "text",
            text: `${generateIdInfoMessage(event.source.groupId, "group")}${stickerInfo ? "\n" + stickerInfo : ""}`
          }]
        })
        break
      case "user":
        // get user info
        const { displayName, pictureUrl, statusMessage, userId } = await client.getProfile(event.source.userId) as messagingApi.UserProfileResponse
        const logRequestBody = {
          "Display Name": displayName,
          "Profile Picture URL": pictureUrl,
          "Status Message": statusMessage,
          "User ID": userId
        }

        const logAPIURL = `${getDomainURL(req)}/api/logUserAccount`
        await customPostRequest<typeof logRequestBody>(logAPIURL, logRequestBody)

        await client.pushMessage({
          to: event.source.userId!, messages: [{
            type: "text",
            text: `${generateIdInfoMessage(event.source.userId, "user")}${stickerInfo ? "\n" + stickerInfo : ""}`
          }]
        })
        break
      default:
        break
    }

    res.status(200).end()
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('An error occurred:', err);
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
    } else {
      console.error('An unknown error occurred:', err);
      res.status(500).json({ error: 'Internal Server Error', message: 'Unknown error occurred' });
    }
  }
}

function generateIdInfoMessage(id: string, type: string) {
  return `Here is your API Info\n${type}ID is: ${id}`
}

function getStickerInfo(event: WebhookEvent) {
  if (event.type !== "message" || event.message.type !== "sticker") return
  const stickerInfo = event.message
  const infoMessage = `StickerId: ${stickerInfo.stickerId}\nPackageId: ${stickerInfo.packageId}`
  return infoMessage
}

function getDomainURL(req: NextApiRequest) {
  // Get the protocol (http or https)
  const protocol = req.headers['x-forwarded-proto'] || 'http'

  // Get the domain
  const host = req.headers['x-forwarded-host'] || req.headers.host

  // Combine protocol, domain, and route to form the full URL
  const fullUrl = `${protocol}://${host}`

  return fullUrl
}
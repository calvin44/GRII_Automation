import { OAuth2Client } from "google-auth-library"
import { gmail_v1, google } from "googleapis"
import { getCurrentDateInfo } from "../dates"

export async function getListLaguFromEmail(oauth2Client: OAuth2Client) {
  // authenticate gmail
  const gmail = google.gmail({ version: "v1", auth: oauth2Client })

  const { month, year } = getCurrentDateInfo()

  try {
    const mailList = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      // q: `from:c_satyaloka@yahoo.com has:attachment after:${year}/${month}/01`,
      q: `from:c_satyaloka@yahoo.com has:attachment after:2024/10/01`,
    })
    const messages = mailList.data.messages || []

    // get message content
    const allAttachments = []

    for (const message of messages) {
      if (!message.id) continue
      // get the message
      const attachments = await fetchMessageAttachments(gmail, message.id)
      allAttachments.push(attachments)

      return allAttachments.flat()
    }
  } catch (err) {
    console.error("Error fetching message list:", err)
    return []
  }
}

async function fetchMessageAttachments(
  gmail: gmail_v1.Gmail,
  messageId: string
) {
  try {
    const msg = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
    })

    const attachments = []
    const parts = msg.data.payload?.parts || []

    for (const part of parts) {
      if (part.filename && part.body?.attachmentId) {
        const attachment = await gmail.users.messages.attachments.get({
          userId: "me",
          messageId,
          id: part.body.attachmentId,
        })

        if (attachment.data.data) {
          attachments.push({
            filename: part.filename,
            // Base64 encoded data
            data: attachment.data.data,
          })
        }
      }
    }
    return attachments
  } catch (err) {
    console.error("Error fetching attachments")
    // Return empty array when error occured
    return []
  }
}

import { NextApiRequest } from "next"

function getDomainURL(req: NextApiRequest) {
  // Get the protocol (http or https)
  const protocol = req.headers['x-forwarded-proto'] || 'http'

  // Get the domain
  const host = req.headers['x-forwarded-host'] || req.headers.host

  // Combine protocol, domain, and route to form the full URL
  const fullUrl = `${protocol}://${host}`

  return fullUrl
}

export { getDomainURL }
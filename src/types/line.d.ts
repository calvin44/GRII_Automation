interface SendLineMessageRequestBody {
  lineUserId: string
}

interface GroupInfo {
  "Group Id": string
  "Group Name": string
  "Picture URL": string
}

interface UserInfo {
  "Display Name": string
  "Profile Picture URL": string
  "Status Message": string
  "User ID": string
}

// Union type for request body
type RequestBody = GroupInfo | UserInfo

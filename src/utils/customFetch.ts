export async function customPostRequest<U>(url: string, postData: U) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch post")
    }
  } catch (error) {
    console.error("Error fetching post:", error)
    throw error
  }
}
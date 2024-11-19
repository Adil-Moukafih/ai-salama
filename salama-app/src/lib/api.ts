const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchData(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`)
  return response.json()
}

import { GoogleGenAI } from '@google/genai'

export function getGeminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  const model = process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash'

  if (!apiKey) {
    return { configured: false, apiKey: null, model }
  }

  return {
    configured: true,
    apiKey,
    model,
    client: new GoogleGenAI({ apiKey }),
  }
}

export function getGeminiClient() {
  const { configured, client } = getGeminiConfig()
  if (!configured || !client) {
    throw new Error('GEMINI_API_KEY is not configured. Set it on the server before using the academic assistant.')
  }
  return client
}

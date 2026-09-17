interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[]
    }
  }[]
}

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: { content: string }
  suggestions: { items: string[] }
  extraIncome: { items: string[] }
  investment: { items: string[] }
  motivation: { content: string }
}


const API_KEY = String(import.meta.env.VITE_GEMINI_API_KEY)
const MODEL_NAME = 'gemini-3.5-flash'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

const callGeminiAPI = async (prompt: string) => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`)
  }

  return (await response.json()) as GeminiResponse
}

const getResponseText = (response: GeminiResponse) => {
  const text = response.candidates[0]?.content.parts[0]?.text

  if (!text) {
    throw new Error('Resposta da IA vazia.')
  }

  return text.trim()
}

const normalizeJsonResponse = (text: string) => {
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim()
}

export const getInsight = async (prompt: string) => {
  const response = await callGeminiAPI(prompt)
  const json = normalizeJsonResponse(getResponseText(response))
  return JSON.parse(json) as InsightData
}

export const getChatAnswer = async (prompt: string) => {
  const response = await callGeminiAPI(prompt)
  return getResponseText(response)
}

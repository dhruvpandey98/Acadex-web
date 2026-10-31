import { AppError } from '../utils/errors.js'
import { getGeminiConfig } from '../config/gemini.js'
import { buildAcademicAssistantPrompt } from './aiPrompt.js'
import { executeAcademicTool, getAcademicToolDefinitions } from './aiTools.js'

function extractTextFromParts(parts = []) {
  if (!Array.isArray(parts)) return ''
  return parts
    .map((part) => {
      if (typeof part === 'string') return part
      if (part?.text) return part.text
      if (part?.functionCall) return JSON.stringify(part.functionCall)
      return ''
    })
    .filter(Boolean)
    .join('\n')
}

function extractCandidateText(result) {
  const directText = result?.text
  if (typeof directText === 'string' && directText.trim()) return directText.trim()

  const candidate = result?.candidates?.[0]
  const candidateText = extractTextFromParts(candidate?.content?.parts)
  if (candidateText.trim()) return candidateText.trim()

  const content = candidate?.content
  if (typeof content === 'string' && content.trim()) return content.trim()

  return ''
}

function extractFunctionCalls(result) {
  const parts = result?.candidates?.[0]?.content?.parts || []
  const calls = []

  for (const part of parts) {
    if (part?.functionCall) {
      calls.push(part.functionCall)
    }
  }

  const responseFunctions = result?.functionCalls || result?.toolCalls || []
  if (Array.isArray(responseFunctions) && responseFunctions.length) {
    calls.push(...responseFunctions)
  }

  return calls
}

export async function generateAcademicAssistantReply({ user, message }) {
  const { configured, model, client } = getGeminiConfig()

  if (!configured || !client) {
    throw new AppError(503, 'Google Gemini is not configured on this server. Set GEMINI_API_KEY and GEMINI_MODEL before using the academic assistant.')
  }

  const prompt = buildAcademicAssistantPrompt({ user, message })
  const modelConfig = {
    temperature: 0.2,
    tools: [{ functionDeclarations: getAcademicToolDefinitions() }],
    toolConfig: { functionCallingConfig: { mode: 'AUTO' } },
  }

  const response = await client.models.generateContent({
    model,
    contents: prompt,
    config: modelConfig,
  })

  const functionCalls = extractFunctionCalls(response)
  if (functionCalls.length) {
    const toolResults = []
    for (const call of functionCalls) {
      const name = call.name || call.functionName || call?.function?.name
      const args = call.args || call.arguments || call?.function?.arguments || {}
      const result = await executeAcademicTool(name, args, user)
      toolResults.push({ toolName: name, args, result })
    }

    const followUp = await client.models.generateContent({
      model,
      contents: [
        {
          text: buildAcademicAssistantPrompt({
            user,
            message,
            toolResults,
          }),
        },
      ],
      config: {
        temperature: 0.2,
      },
    })

    const answer = extractCandidateText(followUp)
    return {
      answer: answer || 'I could not generate a complete answer from the connected database records.',
      toolCalls: functionCalls,
      toolResults,
    }
  }

  const answer = extractCandidateText(response)
  return {
    answer: answer || 'I could not generate a complete answer from the connected database records.',
    toolCalls: [],
    toolResults: [],
  }
}

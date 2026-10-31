import assert from 'node:assert/strict'
import { test } from 'node:test'
import { extractAssistantReply, tutorSystemPrompt } from '../src/services/aiTutor.js'

test('AI tutor prompt uses appropriate privacy guidance for students', () => {
  const prompt = tutorSystemPrompt('student')
  assert.match(prompt, /learner may be a minor/)
  assert.match(prompt, /private student data/)
  assert.match(prompt, /rather than simply doing graded work/)
})

test('Gemini response must contain non-empty assistant text', () => {
  assert.equal(extractAssistantReply({ text: '  Let us work it out.  ' }), 'Let us work it out.')
  assert.equal(extractAssistantReply({ candidates: [{ content: { parts: [{ text: 'Let us work it out.' }] } }] }), 'Let us work it out.')
  assert.throws(() => extractAssistantReply({ candidates: [] }), /empty or unsupported response/)
})

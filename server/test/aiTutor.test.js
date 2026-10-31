import assert from 'node:assert/strict'
import { test } from 'node:test'
import { extractAssistantReply, tutorSystemPrompt } from '../src/services/aiTutor.js'

test('AI tutor prompt uses appropriate privacy guidance for students', () => {
  const prompt = tutorSystemPrompt('student')
  assert.match(prompt, /learner may be a minor/)
  assert.match(prompt, /private student data/)
  assert.match(prompt, /rather than simply doing graded work/)
})

test('AI provider response must contain non-empty assistant text', () => {
  assert.equal(extractAssistantReply({ choices: [{ message: { content: '  Let us work it out.  ' } }] }), 'Let us work it out.')
  assert.throws(() => extractAssistantReply({ choices: [] }), /empty or unsupported response/)
})

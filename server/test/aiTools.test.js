import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getAcademicToolDefinitions } from '../src/services/aiTools.js'

test('academic tool definitions use the Gemini function declaration shape', () => {
  const definitions = getAcademicToolDefinitions()

  assert.ok(definitions.length > 0)
  assert.ok(definitions.every((definition) => (
    typeof definition.name === 'string'
    && typeof definition.description === 'string'
    && definition.parameters?.type === 'OBJECT'
    && !('function' in definition)
    && !('type' in definition)
  )))
})

import { apiRequest } from './api.js'

export const assistantService = {
  conversations: () => apiRequest('/ai/conversations'),
  createConversation: () => apiRequest('/ai/conversations', { method: 'POST' }),
  getConversation: (id) => apiRequest(`/ai/conversations/${encodeURIComponent(id)}`),
  deleteConversation: (id) => apiRequest(`/ai/conversations/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  sendMessage: (id, message) => apiRequest(`/ai/conversations/${encodeURIComponent(id)}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  }),
  askQuestion: (message) => apiRequest('/ai/ask', {
    method: 'POST',
    body: JSON.stringify({ message }),
  }),
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

let refreshInFlight

async function refreshSession() {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    }).catch((error) => {
      throw new Error(`Acadex session could not be refreshed: ${error.message}`)
    }).finally(() => {
      refreshInFlight = undefined
    })
  }
  return refreshInFlight
}

export async function apiRequest(path, options = {}, canRefresh = true) {
  const headers = new Headers(options.headers || {})
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    })
  } catch (error) {
    throw new Error(`Acadex API is unreachable: ${error.message}`)
  }

  const refreshExempt = ['/auth/login', '/auth/register', '/auth/logout', '/auth/forgot-password', '/auth/reset-password', '/auth/refresh']
  if (response.status === 401 && !refreshExempt.includes(path)) {
    if (canRefresh) {
      try {
        const refreshed = await refreshSession()
        if (refreshed.ok) return apiRequest(path, options, false)
      } catch {
        window.dispatchEvent(new Event('acadex:unauthorized'))
        throw new Error('Your session expired and could not be refreshed.')
      }
    }
    window.dispatchEvent(new Event('acadex:unauthorized'))
  }

  if (response.status === 204) return null
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(payload?.error?.message || `Request failed with status ${response.status}.`)
    error.status = response.status
    error.details = payload?.error?.details
    throw error
  }
  return payload
}

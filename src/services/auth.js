import { apiFetch } from './api.js'

export function loginApi(email, password) {
  return apiFetch('/auth/login', { method: 'POST', body: { email, password } })
}

export function registerApi(data) {
  return apiFetch('/auth/register', { method: 'POST', body: data })
}


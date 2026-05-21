import { ref, computed } from 'vue'

const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : ''

const token = ref(localStorage.getItem('myblog-token') || '')
const username = ref(localStorage.getItem('myblog-username') || '')

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value)

  async function login(user, pass) {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass }),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.message)
    token.value = json.data.token
    username.value = json.data.username
    localStorage.setItem('myblog-token', json.data.token)
    localStorage.setItem('myblog-username', json.data.username)
    return json.data
  }

  function logout() {
    token.value = ''
    username.value = ''
    localStorage.removeItem('myblog-token')
    localStorage.removeItem('myblog-username')
  }

  function getAuthHeaders() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  return { token, username, isLoggedIn, login, logout, getAuthHeaders }
}

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : ''
const router = useRouter()
const { isLoggedIn, getAuthHeaders } = useAuth()

const form = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })
const error = ref('')
const success = ref('')
const loading = ref(false)

async function changePassword() {
  error.value = ''
  success.value = ''
  if (!form.value.currentPassword) { error.value = '请输入当前密码'; return }
  if (!form.value.newPassword || form.value.newPassword.length < 6) { error.value = '新密码至少6个字符'; return }
  if (form.value.newPassword !== form.value.confirmPassword) { error.value = '两次密码不一致'; return }
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/api/change-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({
        currentPassword: form.value.currentPassword,
        newPassword: form.value.newPassword,
      }),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.message)
    success.value = '密码修改成功！'
    form.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!isLoggedIn.value) router.push('/login')
})
</script>

<template>
  <div class="settings-page">
    <div class="settings-card">
      <h1 class="title">账号设置</h1>
      <p class="desc">修改登录密码</p>

      <p v-if="error" class="error-msg">{{ error }}</p>
      <p v-if="success" class="success-msg">{{ success }}</p>

      <form @submit.prevent="changePassword" class="settings-form">
        <div class="form-group">
          <input v-model="form.currentPassword" type="password" placeholder="当前密码" class="input" />
        </div>
        <div class="form-group">
          <input v-model="form.newPassword" type="password" placeholder="新密码" class="input" />
        </div>
        <div class="form-group">
          <input v-model="form.confirmPassword" type="password" placeholder="确认新密码" class="input" />
        </div>
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? '修改中...' : '修改密码' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  display: flex;
  justify-content: center;
  padding: 60px 20px;
}

.settings-card {
  width: 100%;
  max-width: 400px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 40px;
}

.title {
  margin: 0 0 4px;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text-primary);
  text-align: center;
}

.desc {
  margin: 0 0 24px;
  color: var(--color-text-tertiary);
  font-size: 0.85rem;
  text-align: center;
}

.error-msg {
  padding: 10px;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: 16px;
  text-align: center;
}

.success-msg {
  padding: 10px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: 16px;
  text-align: center;
}

.dark .error-msg { background: #450a0a; color: #fca5a5; }
.dark .success-msg { background: #14532d; color: #4ade80; }

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group { display: flex; flex-direction: column; gap: 4px; }

.input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg);
  color: var(--color-text-primary);
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border-color var(--transition-fast);
  box-sizing: border-box;
}

.input:focus { border-color: var(--color-accent); }

.submit-btn {
  padding: 10px;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.submit-btn:hover:not(:disabled) { opacity: 0.9; }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>

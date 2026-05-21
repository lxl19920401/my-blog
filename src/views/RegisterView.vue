<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : ''
const router = useRouter()
const { login } = useAuth()

const form = ref({ username: '', password: '', confirmPassword: '' })
const error = ref('')
const loading = ref(false)

const formErrors = computed(() => {
  const errs = {}
  if (!form.value.username.trim()) errs.username = '请输入用户名'
  else if (form.value.username.length < 3) errs.username = '用户名至少3个字符'
  if (!form.value.password) errs.password = '请输入密码'
  else if (form.value.password.length < 6) errs.password = '密码至少6个字符'
  if (form.value.password !== form.value.confirmPassword) errs.confirmPassword = '两次密码不一致'
  return errs
})

async function handleRegister() {
  if (Object.keys(formErrors.value).length) return
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: form.value.username.trim(), password: form.value.password }),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.message)
    await login(form.value.username.trim(), form.value.password)
    router.push('/manage')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-page">
    <div class="register-card">
      <h1 class="title">注册账号</h1>
      <p class="desc">创建账号后可以发布和管理文章</p>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <input v-model="form.username" type="text" placeholder="用户名" class="input" />
          <span v-if="formErrors.username" class="field-error">{{ formErrors.username }}</span>
        </div>
        <div class="form-group">
          <input v-model="form.password" type="password" placeholder="密码" class="input" />
          <span v-if="formErrors.password" class="field-error">{{ formErrors.password }}</span>
        </div>
        <div class="form-group">
          <input v-model="form.confirmPassword" type="password" placeholder="确认密码" class="input" />
          <span v-if="formErrors.confirmPassword" class="field-error">{{ formErrors.confirmPassword }}</span>
        </div>
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>

      <p class="login-link">
        已有账号？<router-link to="/login">登录</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  padding: 60px 20px;
}

.register-card {
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

.dark .error-msg {
  background: #450a0a;
  color: #fca5a5;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

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

.field-error {
  font-size: 0.78rem;
  color: #ef4444;
}

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

.login-link {
  text-align: center;
  margin: 20px 0 0;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.login-link a { font-weight: 600; }
</style>

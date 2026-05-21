<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码'
    return
  }
  loading.value = true
  try {
    await login(username.value, password.value)
    router.push('/manage')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">管理员登录</h1>
      <form @submit.prevent="handleSubmit">
        <div class="field">
          <input v-model="username" type="text" placeholder="用户名" class="input" />
        </div>
        <div class="field">
          <input v-model="password" type="password" placeholder="密码" class="input" />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      <div class="links">
        <router-link to="/register" class="register-link">注册账号</router-link>
        <span class="sep">·</span>
        <router-link to="/" class="back">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.login-card {
  width: 100%;
  max-width: 360px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 40px 32px;
  text-align: center;
}

.login-title {
  margin: 0 0 24px;
  font-size: 1.3rem;
  color: var(--color-text-primary);
}

.field {
  margin-bottom: 14px;
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

.input:focus {
  border-color: var(--color-accent);
}

.error {
  color: #ef4444;
  font-size: 0.85rem;
  margin: -6px 0 14px;
}

.btn {
  width: 100%;
  padding: 10px;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.btn:hover:not(:disabled) { opacity: 0.9; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }

.links {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}

.register-link {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 600;
}

.register-link:hover {
  text-decoration: underline;
}

.sep {
  color: var(--color-border);
}

.back {
  color: var(--color-text-tertiary);
  text-decoration: none;
}

.back:hover { color: var(--color-accent); }
</style>

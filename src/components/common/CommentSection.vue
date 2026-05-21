<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  postSlug: { type: String, required: true },
})

const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : ''

const comments = ref([])
const loading = ref(true)
const error = ref('')
const submitting = ref(false)
const submitSuccess = ref(false)

const form = ref({
  username: '',
  email: '',
  content: '',
})

const savedUser = ref({
  username: localStorage.getItem('comment-username') || '',
  email: localStorage.getItem('comment-email') || '',
})

form.value.username = savedUser.value.username
form.value.email = savedUser.value.email

const formErrors = computed(() => {
  const errs = {}
  if (!form.value.username.trim()) errs.username = '请输入用户名'
  else if (form.value.username.length > 50) errs.username = '用户名不能超过50个字符'
  if (form.value.email && !/^\S+@\S+\.\S+$/.test(form.value.email)) errs.email = '邮箱格式不正确'
  if (!form.value.content.trim()) errs.content = '请输入评论内容'
  else if (form.value.content.length > 1000) errs.content = '评论内容不能超过1000个字符'
  return errs
})

async function fetchComments() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/api/posts/${props.postSlug}/comments`)
    const json = await res.json()
    if (json.success) {
      comments.value = json.data
    } else {
      error.value = json.message || '加载评论失败'
    }
  } catch (e) {
    error.value = '无法连接到服务器，请稍后重试'
  } finally {
    loading.value = false
  }
}

async function submitComment() {
  if (Object.keys(formErrors.value).length) return
  submitting.value = true
  submitSuccess.value = false
  try {
    const res = await fetch(`${API_BASE}/api/posts/${props.postSlug}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.value.username.trim(),
        email: form.value.email.trim() || null,
        content: form.value.content.trim(),
      }),
    })
    const json = await res.json()
    if (json.success) {
      localStorage.setItem('comment-username', form.value.username.trim())
      if (form.value.email.trim()) localStorage.setItem('comment-email', form.value.email.trim())
      form.value.content = ''
      submitSuccess.value = true
      setTimeout(() => { submitSuccess.value = false }, 3000)
      await fetchComments()
    } else {
      error.value = json.message || '发布评论失败'
    }
  } catch (e) {
    error.value = '无法连接到服务器，请稍后重试'
  } finally {
    submitting.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

onMounted(fetchComments)
</script>

<template>
  <section class="comment-section">
    <h3 class="comment-section-title">
      评论
      <span v-if="comments.length" class="comment-count">({{ comments.length }})</span>
    </h3>

    <div v-if="loading" class="comment-loading">
      <div class="skeleton-line" />
      <div class="skeleton-line" />
      <div class="skeleton-line short" />
    </div>

    <div v-else-if="error && !comments.length" class="comment-error">
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchComments">重新加载</button>
    </div>

    <template v-else>
      <div v-if="comments.length" class="comment-list">
        <div v-for="c in comments" :key="c.id" class="comment-item">
          <div class="comment-header">
            <span class="comment-author">{{ c.username }}</span>
            <span class="comment-time">{{ formatDate(c.created_at) }}</span>
          </div>
          <p class="comment-body">{{ c.content }}</p>
        </div>
      </div>

      <div v-else class="comment-empty">
        <p>暂无评论，来发表第一条评论吧！</p>
      </div>
    </template>

    <div v-if="submitSuccess" class="submit-success">评论发布成功！</div>

    <form class="comment-form" @submit.prevent="submitComment">
      <h4 class="form-title">发表评论</h4>

      <div class="form-row">
        <input
          v-model="form.username"
          type="text"
          placeholder="昵称 *"
          class="form-input"
          maxlength="50"
        />
        <input
          v-model="form.email"
          type="email"
          placeholder="邮箱（选填）"
          class="form-input"
        />
      </div>

      <textarea
        v-model="form.content"
        placeholder="写下你的评论... *"
        class="form-textarea"
        maxlength="1000"
        rows="4"
      />

      <div class="form-footer">
        <span v-if="formErrors.username || formErrors.email || formErrors.content" class="form-error">
          {{ formErrors.username || formErrors.email || formErrors.content }}
        </span>
        <button type="submit" class="submit-btn" :disabled="submitting">
          {{ submitting ? '发布中...' : '发布评论' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.comment-section {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--color-border);
}

.comment-section-title {
  margin: 0 0 24px;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.comment-count {
  font-weight: 400;
  color: var(--color-text-tertiary);
  font-size: 0.9rem;
}

.comment-loading {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.skeleton-line {
  height: 14px;
  background: var(--color-bg-secondary);
  border-radius: 6px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-line.short {
  width: 60%;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

.comment-error {
  text-align: center;
  padding: 24px;
  color: var(--color-text-tertiary);
}

.retry-btn {
  padding: 6px 16px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  transition: all var(--transition-fast);
}

.retry-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.comment-item {
  padding: 16px;
  background: var(--color-bg-secondary);
  border-radius: 8px;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text-primary);
}

.comment-time {
  font-size: 0.78rem;
  color: var(--color-text-tertiary);
}

.comment-body {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.comment-empty {
  text-align: center;
  padding: 32px 16px;
  color: var(--color-text-tertiary);
  font-size: 0.9rem;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
  margin-bottom: 32px;
}

.submit-success {
  text-align: center;
  padding: 10px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 16px;
}

.dark .submit-success {
  background: #14532d;
  color: #4ade80;
}

.comment-form {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 20px;
}

.form-title {
  margin: 0 0 16px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg);
  color: var(--color-text-primary);
  font-family: inherit;
  font-size: 0.9rem;
  outline: none;
  transition: border-color var(--transition-fast);
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--color-accent);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  margin-bottom: 12px;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.form-error {
  font-size: 0.82rem;
  color: #ef4444;
}

.submit-btn {
  padding: 8px 24px;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: opacity var(--transition-fast);
  flex-shrink: 0;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 767px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

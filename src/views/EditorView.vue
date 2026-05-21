<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { renderMarkdown } from '../utils/markdown'

const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : ''
const route = useRoute()
const router = useRouter()
const { isLoggedIn, getAuthHeaders } = useAuth()

const editing = ref(!!route.params.slug)
const saving = ref(false)
const message = ref('')

const form = ref({
  title: '',
  content: '',
  description: '',
  tags: '',
  sticky: false,
})

const previewHtml = computed(() => {
  if (!form.value.content) return '<p style="color:var(--color-text-tertiary)">预览区域</p>'
  return renderMarkdown(form.value.content)
})

function generateSlug(title) {
  return title.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 100) || 'post'
}

async function loadPost() {
  if (!route.params.slug) return
  try {
    const res = await fetch(`${API_BASE}/api/posts/${route.params.slug}`)
    const json = await res.json()
    if (!json.success) throw new Error(json.message)
    form.value.title = json.data.title
    form.value.content = json.data.content
    form.value.description = json.data.description || ''
    form.value.tags = (json.data.tags || []).join(', ')
    form.value.sticky = !!json.data.sticky
  } catch (e) {
    message.value = '加载文章失败: ' + e.message
  }
}

async function save() {
  if (!form.value.title || !form.value.content) {
    message.value = '标题和内容不能为空'
    return
  }
  saving.value = true
  message.value = ''
  const body = {
    title: form.value.title.trim(),
    content: form.value.content,
    description: form.value.description.trim(),
    tags: form.value.tags.split(',').map(t => t.trim()).filter(Boolean),
    sticky: form.value.sticky ? 1 : 0,
  }
  try {
    const slug = editing.value ? route.params.slug : generateSlug(form.value.title)
    const url = editing.value ? `${API_BASE}/api/posts/${slug}` : `${API_BASE}/api/posts`
    const method = editing.value ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.message)
    message.value = '✅ 文章保存成功！'
    if (!editing.value) {
      editing.value = true
      router.replace(`/editor/${json.data.slug || slug}`)
    }
  } catch (e) {
    message.value = '❌ ' + e.message
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  if (route.params.slug) loadPost()
})
</script>

<template>
  <div class="editor-page">
    <div class="editor-toolbar">
      <h1 class="editor-title">{{ editing ? '编辑文章' : '写文章' }}</h1>
      <div class="toolbar-actions">
        <label class="sticky-label">
          <input v-model="form.sticky" type="checkbox" /> 置顶
        </label>
        <button class="save-btn" :disabled="saving" @click="save">
          {{ saving ? '保存中...' : '发布' }}
        </button>
      </div>
    </div>

    <p v-if="message" class="message" :class="{ success: message.includes('✅') }">{{ message }}</p>

    <div class="editor-form">
      <div class="form-row">
        <input v-model="form.title" placeholder="文章标题" class="input title-input" />
      </div>
      <div class="form-row">
        <input v-model="form.tags" placeholder="标签（用逗号分隔）" class="input" />
      </div>
      <div class="form-row">
        <input v-model="form.description" placeholder="文章摘要（选填）" class="input" />
      </div>
      <div class="editor-split">
        <div class="editor-pane">
          <div class="pane-label">Markdown</div>
          <textarea v-model="form.content" class="editor-textarea" placeholder="在此编写 Markdown 内容..." />
        </div>
        <div class="preview-pane">
          <div class="pane-label">预览</div>
          <div class="preview-content" v-html="previewHtml" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-page {
  max-width: 1200px;
  margin: 0 auto;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.editor-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sticky-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.save-btn {
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
}

.save-btn:hover:not(:disabled) { opacity: 0.9; }
.save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.message {
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  margin: 0 0 16px;
}

.message.success { background: #dcfce7; color: #16a34a; }

.dark .message.success { background: #14532d; color: #4ade80; }

.editor-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row { width: 100%; }

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

.title-input { font-size: 1.1rem; font-weight: 600; }

.editor-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  min-height: 500px;
}

.editor-pane, .preview-pane {
  display: flex;
  flex-direction: column;
}

.pane-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.editor-textarea {
  flex: 1;
  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg);
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  font-size: 0.88rem;
  line-height: 1.7;
  resize: vertical;
  outline: none;
  transition: border-color var(--transition-fast);
  min-height: 400px;
}

.editor-textarea:focus { border-color: var(--color-accent); }

.preview-content {
  flex: 1;
  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-card);
  overflow-y: auto;
  line-height: 1.8;
  font-size: 0.95rem;
  color: var(--color-text-primary);
}

.preview-content :deep(h2),
.preview-content :deep(h3),
.preview-content :deep(h4) {
  margin-top: 1.8em;
  margin-bottom: 0.6em;
  font-weight: 700;
  color: var(--color-text-primary);
}
.preview-content :deep(h2) {
  font-size: 1.5rem;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}
.preview-content :deep(h3) { font-size: 1.2rem; }
.preview-content :deep(p) { margin: 0 0 1em; line-height: 1.8; }
.preview-content :deep(a) { color: var(--color-accent); text-decoration: underline; text-underline-offset: 2px; }
.preview-content :deep(a:hover) { color: var(--color-accent-hover); }
.preview-content :deep(img) { max-width: 100%; height: auto; border-radius: 8px; margin: 1em 0; }
.preview-content :deep(blockquote) {
  margin: 1em 0;
  padding: 12px 20px;
  border-left: 4px solid var(--color-accent);
  background: var(--color-bg-secondary);
  border-radius: 0 8px 8px 0;
  color: var(--color-text-secondary);
}
.preview-content :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.88em;
  padding: 2px 6px;
  background: var(--color-bg-code);
  border-radius: 4px;
  color: var(--color-accent);
}
.preview-content :deep(pre) {
  margin: 1em 0;
  padding: 16px 20px;
  background: var(--color-bg-code);
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid var(--color-border);
}
.preview-content :deep(pre code) { padding: 0; background: none; color: inherit; font-size: 0.88rem; line-height: 1.6; }
.preview-content :deep(ul),
.preview-content :deep(ol) { margin: 0 0 1em; padding-left: 1.5em; }
.preview-content :deep(li) { margin-bottom: 0.4em; }
.preview-content :deep(hr) { border: none; height: 1px; background: var(--color-border); margin: 2em 0; }
.preview-content :deep(table) { width: 100%; border-collapse: collapse; margin: 1em 0; font-size: 0.9rem; }
.preview-content :deep(th),
.preview-content :deep(td) { padding: 10px 14px; border: 1px solid var(--color-border); text-align: left; }
.preview-content :deep(th) { background: var(--color-bg-secondary); font-weight: 600; }

@media (max-width: 767px) {
  .editor-split { grid-template-columns: 1fr; }
  .editor-toolbar { flex-direction: column; align-items: stretch; }
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : ''
const router = useRouter()
const { isLoggedIn, getAuthHeaders } = useAuth()

const posts = ref([])
const loading = ref(true)
const error = ref('')
const deleting = ref(null)

async function fetchPosts() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/api/posts`)
    const json = await res.json()
    if (!json.success) throw new Error(json.message)
    posts.value = json.data
  } catch (e) {
    error.value = '加载文章列表失败: ' + e.message
  } finally {
    loading.value = false
  }
}

async function deletePost(slug) {
  if (!confirm('确定要删除这篇文章吗？')) return
  deleting.value = slug
  try {
    const res = await fetch(`${API_BASE}/api/posts/${slug}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.message)
    posts.value = posts.value.filter(p => p.slug !== slug)
  } catch (e) {
    alert('删除失败: ' + e.message)
  } finally {
    deleting.value = null
  }
}

function editPost(slug) {
  router.push(`/editor/${slug}`)
}

function createPost() {
  router.push('/editor')
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

onMounted(() => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  fetchPosts()
})
</script>

<template>
  <div class="manage-page">
    <div class="manage-header">
      <h1 class="page-title">文章管理</h1>
      <button class="create-btn" @click="createPost">+ 新建文章</button>
    </div>

    <p v-if="error" class="error-msg">{{ error }}</p>

    <div v-if="loading" class="loading-state">
      <div class="skeleton-line" />
      <div class="skeleton-line" />
      <div class="skeleton-line short" />
    </div>

    <div v-else-if="!posts.length" class="empty-state">
      <p>暂无文章，开始写第一篇吧！</p>
    </div>

    <div v-else class="post-table">
      <div class="table-header">
        <span class="col-title">标题</span>
        <span class="col-tags">标签</span>
        <span class="col-date">创建时间</span>
        <span class="col-sticky">置顶</span>
        <span class="col-actions">操作</span>
      </div>
      <div v-for="post in posts" :key="post.slug" class="table-row">
        <span class="col-title">{{ post.title }}</span>
        <span class="col-tags">
          <span v-for="tag in (post.tags || [])" :key="tag" class="tag-badge">{{ tag }}</span>
          <span v-if="!post.tags || !post.tags.length" class="no-tags">无</span>
        </span>
        <span class="col-date">{{ formatDate(post.created_at) }}</span>
        <span class="col-sticky">
          <span v-if="post.sticky" class="sticky-yes">是</span>
          <span v-else class="sticky-no">否</span>
        </span>
        <span class="col-actions">
          <button class="action-btn edit" @click="editPost(post.slug)">编辑</button>
          <button
            class="action-btn delete"
            :disabled="deleting === post.slug"
            @click="deletePost(post.slug)"
          >
            {{ deleting === post.slug ? '删除中...' : '删除' }}
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.manage-page {
  max-width: var(--max-width);
  margin: 0 auto;
}

.manage-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text-primary);
}

.create-btn {
  padding: 10px 24px;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.create-btn:hover { opacity: 0.9; }

.error-msg {
  padding: 10px 14px;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 16px;
}

.dark .error-msg {
  background: #450a0a;
  color: #fca5a5;
}

.loading-state {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  height: 16px;
  background: var(--color-bg-secondary);
  border-radius: 6px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-line.short { width: 60%; }

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-tertiary);
}

.post-table {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 3fr 2fr 1fr 80px 140px;
  padding: 14px 20px;
  background: var(--color-bg-secondary);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.table-row {
  display: grid;
  grid-template-columns: 3fr 2fr 1fr 80px 140px;
  padding: 16px 20px;
  border-top: 1px solid var(--color-border-light);
  align-items: center;
  font-size: 0.9rem;
  color: var(--color-text-primary);
  transition: background var(--transition-fast);
}

.table-row:hover {
  background: var(--color-bg-secondary);
}

.col-title {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag-badge {
  display: inline-block;
  padding: 2px 8px;
  font-size: 0.75rem;
  color: var(--color-accent);
  background: var(--color-accent-light);
  border-radius: 4px;
  font-weight: 500;
}

.no-tags {
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
}

.col-date {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.col-sticky {
  text-align: center;
}

.sticky-yes {
  color: var(--color-accent);
  font-weight: 600;
  font-size: 0.85rem;
}

.sticky-no {
  color: var(--color-text-tertiary);
  font-size: 0.85rem;
}

.col-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 4px 14px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.82rem;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
}

.action-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.delete:hover:not(:disabled) {
  border-color: #ef4444;
  color: #ef4444;
}

@media (max-width: 767px) {
  .table-header { display: none; }
  .table-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    align-items: flex-start;
  }
  .col-actions { align-self: flex-end; }
}
</style>

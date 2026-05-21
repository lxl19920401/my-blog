<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPostBySlug, getAdjacentPosts, getRelatedPosts } from '../utils/posts'
import { renderMarkdown, extractHeadings } from '../utils/markdown'
import ReadingProgress from '../components/common/ReadingProgress.vue'
import CommentSection from '../components/common/CommentSection.vue'

const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : ''
const route = useRoute()
const postContent = ref(null)
const loadingContent = ref(false)

const post = computed(() => postContent.value || getPostBySlug(route.params.slug))
const adjacent = computed(() => getAdjacentPosts(route.params.slug))
const related = computed(() => getRelatedPosts(route.params.slug, 3))
const liked = ref(false)

async function ensureContent() {
  const p = getPostBySlug(route.params.slug)
  if (!p) return
  if (p.source === 'api' && !p.content) {
    loadingContent.value = true
    try {
      const res = await fetch(`${API_BASE}/api/posts/${route.params.slug}`)
      const json = await res.json()
      if (json.success) {
        const c = json.data.content || ''
        const html = renderMarkdown(c)
        const headings = extractHeadings(c)
        postContent.value = { ...p, content: c, html, headings }
      }
    } catch { /* ignore */ } finally {
      loadingContent.value = false
    }
  }
}

if (post.value) {
  const key = `blog-liked-${post.value.slug}`
  liked.value = localStorage.getItem(key) === 'true'
}

onMounted(ensureContent)
watch(post, (val) => {
  if (val && val.source === 'api' && !val.content) ensureContent()
})

function toggleLike() {
  if (!post.value) return
  const key = `blog-liked-${post.value.slug}`
  liked.value = !liked.value
  localStorage.setItem(key, liked.value)
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function scrollToHeading(id) {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 90
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

function highlightSearch(word) {
  return word
}
</script>

<template>
  <div class="post-detail-layout">
    <ReadingProgress />

    <article v-if="post" class="post-article">
      <header class="post-header">
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-meta">
          <span v-if="post.date" class="meta-item">
            发布于 {{ formatDate(post.date) }}
          </span>
          <span v-if="post.updated && post.updated !== post.date" class="meta-item">
            更新于 {{ formatDate(post.updated) }}
          </span>
          <span class="meta-item">{{ post.readingTime }} 分钟阅读</span>
        </div>
        <div v-if="post.tags && post.tags.length" class="post-tags">
          <router-link
            v-for="tag in post.tags"
            :key="tag"
            :to="`/tag/${tag}`"
            class="tag"
          >
            {{ tag }}
          </router-link>
        </div>
      </header>

      <div v-if="post.headings && post.headings.length" class="post-toc">
        <h4 class="toc-title">目录</h4>
        <ul class="toc-list">
          <li
            v-for="(h, idx) in post.headings"
            :key="idx"
            :style="{ paddingLeft: (h.depth - 1) * 12 + 'px' }"
          >
            <a :href="'#' + h.id" class="toc-link" @click.prevent="scrollToHeading(h.id)">
              {{ h.text }}
            </a>
          </li>
        </ul>
      </div>

      <div v-if="loadingContent" class="post-loading">
        <div class="skeleton-line" />
        <div class="skeleton-line" />
        <div class="skeleton-line short" />
        <div class="skeleton-line" />
        <div class="skeleton-line" />
        <div class="skeleton-line short" />
      </div>

      <div v-else class="post-content" v-html="post.html" />

      <div class="post-actions">
        <button class="like-btn" :class="{ liked }" @click="toggleLike">
          {{ liked ? '❤️' : '🤍' }} {{ liked ? '已点赞' : '点赞' }}
        </button>
      </div>

      <nav class="post-nav">
        <router-link
          v-if="adjacent.prev"
          :to="`/post/${adjacent.prev.slug}`"
          class="nav-item prev"
        >
          <span class="nav-label">← 上一篇</span>
          <span class="nav-title">{{ adjacent.prev.title }}</span>
        </router-link>
        <div v-else class="nav-item disabled" />

        <router-link
          v-if="adjacent.next"
          :to="`/post/${adjacent.next.slug}`"
          class="nav-item next"
        >
          <span class="nav-label">下一篇 →</span>
          <span class="nav-title">{{ adjacent.next.title }}</span>
        </router-link>
        <div v-else class="nav-item disabled" />
      </nav>

      <CommentSection :post-slug="post.slug" />
    </article>

    <aside v-if="related.length" class="related-posts">
      <h3 class="related-title">相关文章</h3>
      <div class="related-grid">
        <router-link
          v-for="rp in related"
          :key="rp.slug"
          :to="`/post/${rp.slug}`"
          class="related-card"
        >
          <h4 class="related-card-title">{{ rp.title }}</h4>
          <p class="related-card-desc">{{ rp.description || rp.content.slice(0, 80) + '...' }}</p>
        </router-link>
      </div>
    </aside>

    <div v-if="!post" class="not-found">
      <h2>文章不存在</h2>
      <router-link to="/" class="back-link">返回首页</router-link>
    </div>
  </div>
</template>

<style scoped>
.post-detail-layout {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 var(--page-padding);
}

.post-article {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 40px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.post-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}

.post-title {
  margin: 0 0 12px;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.35;
  color: var(--color-text-primary);
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 0.85rem;
  color: var(--color-text-tertiary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-block;
  padding: 3px 12px;
  font-size: 0.8rem;
  color: var(--color-accent);
  background: var(--color-accent-light);
  border-radius: 20px;
  text-decoration: none;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.tag:hover {
  background: var(--color-accent);
  color: #fff;
}

.post-toc {
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  margin-bottom: 32px;
  backdrop-filter: blur(8px);
}

.toc-title {
  margin: 0 0 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-link {
  display: block;
  padding: 3px 0;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
  line-height: 1.5;
}

.toc-link:hover {
  color: var(--color-accent);
}

.post-content {
  line-height: 1.8;
  font-size: 1rem;
  color: var(--color-text-primary);
  overflow-wrap: break-word;
}

.post-content :deep(h2),
.post-content :deep(h3),
.post-content :deep(h4) {
  margin-top: 1.8em;
  margin-bottom: 0.6em;
  font-weight: 700;
  color: var(--color-text-primary);
}

.post-content :deep(h2) {
  font-size: 1.5rem;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}

.post-content :deep(h3) {
  font-size: 1.2rem;
}

.post-content :deep(p) {
  margin: 0 0 1em;
}

.post-content :deep(a) {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.post-content :deep(a:hover) {
  color: var(--color-accent-hover);
}

.post-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1em 0;
  cursor: zoom-in;
}

.post-content :deep(img):active {
  cursor: zoom-out;
}

.post-content :deep(blockquote) {
  margin: 1em 0;
  padding: 12px 20px;
  border-left: 4px solid var(--color-accent);
  background: var(--color-bg-secondary);
  border-radius: 0 8px 8px 0;
  color: var(--color-text-secondary);
}

.post-content :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.88em;
  padding: 2px 6px;
  background: var(--color-bg-code);
  border-radius: 4px;
  color: var(--color-accent);
}

.post-content :deep(pre) {
  margin: 1em 0;
  padding: 16px 20px;
  background: var(--color-bg-code);
  border-radius: var(--radius-md);
  overflow-x: auto;
  border: 1px solid var(--color-border);
  transition: border-color var(--transition-fast);
}

.post-content :deep(pre):hover {
  border-color: var(--color-accent);
  box-shadow: 0 0 16px var(--color-accent-glow);
}

.post-content :deep(pre code) {
  padding: 0;
  background: none;
  color: inherit;
  font-size: 0.88rem;
  line-height: 1.6;
}

.post-content :deep(ul),
.post-content :deep(ol) {
  margin: 0 0 1em;
  padding-left: 1.5em;
}

.post-content :deep(li) {
  margin-bottom: 0.4em;
}

.post-content :deep(hr) {
  border: none;
  height: 1px;
  background: var(--color-border);
  margin: 2em 0;
}

.post-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  font-size: 0.9rem;
}

.post-content :deep(th),
.post-content :deep(td) {
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  text-align: left;
}

.post-content :deep(th) {
  background: var(--color-bg-secondary);
  font-weight: 600;
}

.post-actions {
  display: flex;
  justify-content: center;
  margin: 40px 0;
  padding-top: 32px;
  border-top: 1px solid var(--color-border);
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 24px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
}

.like-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.like-btn.liked {
  background: #fef2f2;
  border-color: #ef4444;
  color: #ef4444;
}

.dark .like-btn.liked {
  background: #450a0a;
}

.post-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 32px;
}

.nav-item {
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
  background: var(--color-bg-glass);
  backdrop-filter: blur(8px);
}

.nav-item:hover {
  border-color: var(--color-accent);
  box-shadow: 0 0 12px var(--color-accent-glow);
}

.nav-item.next {
  text-align: right;
}

.nav-item.disabled {
  visibility: hidden;
}

.nav-label {
  display: block;
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
  margin-bottom: 4px;
}

.nav-title {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-primary);
  transition: color var(--transition-fast);
}

.nav-item:hover .nav-title {
  color: var(--color-accent);
}

.related-posts {
  margin-top: 40px;
}

.related-title {
  margin: 0 0 16px;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.related-card {
  display: block;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
  background: var(--color-bg-glass);
  backdrop-filter: blur(8px);
}

.related-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.related-card-title {
  margin: 0 0 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.related-card-desc {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-loading {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 0;
}

.skeleton-line {
  height: 16px;
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

.not-found {
  text-align: center;
  padding: 80px 20px;
}

.back-link {
  color: var(--color-accent);
  text-decoration: none;
}

@media (max-width: 767px) {
  .post-article {
    padding: 20px;
  }
  .post-title {
    font-size: 1.5rem;
  }
  .related-grid {
    grid-template-columns: 1fr;
  }
  .post-nav {
    grid-template-columns: 1fr;
  }
  .post-nav .next {
    text-align: left;
  }
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getAllPosts } from '../utils/posts'
import { siteConfig } from '../config/site'
import ProjectSection from '../components/projects/ProjectSection.vue'
import PostCard from '../components/common/PostCard.vue'
import Pagination from '../components/common/Pagination.vue'

const posts = computed(() => getAllPosts())
const currentPage = ref(1)
const pageSize = siteConfig.pagination.pageSize
const searchQuery = ref('')

const typewriterPhrases = [
  '热爱技术，专注前端与全栈开发',
  '用代码构建更好的数字世界',
  '记录学习，分享思考',
]
const currentPhrase = ref(0)
const displayText = ref('')
const charIndex = ref(0)

let typeInterval = null

function startTypewriter() {
  const phrase = typewriterPhrases[currentPhrase.value]
  if (charIndex.value < phrase.length) {
    charIndex.value++
    displayText.value = phrase.slice(0, charIndex.value)
  } else {
    clearInterval(typeInterval)
    setTimeout(() => {
      charIndex.value = 0
      displayText.value = ''
      currentPhrase.value = (currentPhrase.value + 1) % typewriterPhrases.length
      typeInterval = setInterval(startTypewriter, 60)
    }, 2500)
    return
  }
}

onMounted(() => {
  typeInterval = setInterval(startTypewriter, 60)
})

onUnmounted(() => {
  if (typeInterval) clearInterval(typeInterval)
})

const filteredPosts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return posts.value
  return posts.value.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / pageSize)))

const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPosts.value.slice(start, start + pageSize)
})

function onPageChange(page) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="home-view">
    <section class="hero">
      <div class="hero-body">
        <img :src="siteConfig.author.avatar" :alt="siteConfig.author.name" class="hero-avatar" />
        <h1 class="hero-title">
          <span class="gradient-text">{{ siteConfig.author.name }}</span>
        </h1>
        <p class="hero-sub">
          <span class="typewriter-text">{{ displayText }}</span>
          <span class="typewriter-cursor" />
        </p>
        <ProjectSection />
      </div>
    </section>

    <section class="posts">
      <header class="posts-header">
        <h2 class="posts-heading">最新文章</h2>
        <div class="search">
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="搜索文章..."
            @input="currentPage = 1"
          />
        </div>
      </header>

      <div v-if="pagedPosts.length" class="post-grid">
        <PostCard v-for="post in pagedPosts" :key="post.slug" :post="post" />
      </div>
      <div v-else class="empty">
        <p v-if="searchQuery.trim()">未找到与「{{ searchQuery.trim() }}」相关的文章</p>
        <p v-else>暂无文章</p>
      </div>

      <Pagination
        v-if="!searchQuery.trim()"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="onPageChange"
      />
    </section>
  </div>
</template>

<style scoped>
.home-view {
  width: 100%;
}

/* ── Hero ── */
.hero {
  padding: 80px var(--page-padding) 56px;
  text-align: center;
}

.hero-body {
  max-width: var(--max-width);
  margin: 0 auto;
}

.hero-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 12px;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.hero-sub {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin: 0 0 28px;
  min-height: 1.6em;
  font-weight: 400;
}

.typewriter-cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background: var(--color-accent);
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: typing-cursor 0.8s step-end infinite;
}

/* ── Posts ── */
.posts {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--page-padding) 64px;
}

.posts-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.posts-heading {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.search-input {
  padding: 6px 12px;
  border: none;
  border-bottom: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-primary);
  font-size: 0.85rem;
  font-family: inherit;
  outline: none;
  transition: border-color var(--transition-fast);
  width: 160px;
}

.search-input:focus {
  border-bottom-color: var(--color-accent);
}

.search-input::placeholder {
  color: var(--color-text-tertiary);
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-tertiary);
  font-size: 0.95rem;
}

@media (max-width: 1023px) {
  .hero-title {
    font-size: 2.2rem;
  }
  .post-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .hero {
    padding: 48px 16px 40px;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .hero-sub {
    font-size: 0.95rem;
  }

  .hero-avatar {
    width: 52px;
    height: 52px;
    margin-bottom: 16px;
  }

  .posts {
    padding: 0 16px 48px;
  }

  .posts-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .search-input {
    width: 100%;
  }

  .post-grid {
    grid-template-columns: 1fr;
  }
}
</style>

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
    <!-- Hero -->
    <section class="hero">
      <div class="hero-greeting">
        <img :src="siteConfig.author.avatar" :alt="siteConfig.author.name" class="hero-avatar" />
        <span class="hero-greeting-text">hi there, i'm</span>
      </div>
      <h1 class="hero-title gradient-text">{{ siteConfig.author.name }}</h1>
      <p class="hero-sub">
        <span class="typewriter-text">{{ displayText }}</span>
        <span class="typewriter-cursor" />
      </p>
    </section>

    <section class="projects-section">
      <h2 class="section-label"><span class="prompt">❯</span> projects</h2>
      <ProjectSection />
    </section>

    <div class="posts-divider" aria-hidden="true">━━━</div>

    <!-- Posts -->
    <section class="posts">
      <header class="posts-header">
        <h2 class="posts-heading"><span class="prompt">❯</span> articles <span class="heading-year">{{ new Date().getFullYear() }}</span></h2>
        <label class="search">
          <span class="search-icon">/</span>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="search"
            @input="currentPage = 1"
          />
        </label>
      </header>

      <div v-if="pagedPosts.length" class="post-list">
        <PostCard
          v-for="(post, idx) in pagedPosts"
          :key="post.slug"
          :post="post"
          :index="(currentPage - 1) * pageSize + idx + 1"
        />
      </div>
      <div v-else class="empty">
        <p v-if="searchQuery.trim()">no results for &lsquo;{{ searchQuery.trim() }}&rsquo;</p>
        <p v-else>nothing here yet</p>
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
  position: relative;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 56px var(--page-padding) 32px;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0);
  background-size: 32px 32px;
  mask-image: linear-gradient(to bottom, black 30%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 30%, transparent 100%);
  pointer-events: none;
}

.hero-greeting {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.hero-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  filter: grayscale(0.3);
}

.hero-greeting-text {
  font-size: 0.85rem;
  color: var(--color-text-tertiary);
  font-weight: 400;
  letter-spacing: 0.02em;
}

.hero-title {
  position: relative;
  z-index: 1;
  margin: 8px 0 0;
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 7vw, 4.8rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
}

.hero-sub {
  position: relative;
  z-index: 1;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin: 10px 0 0;
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

/* ── Projects Section ── */
.projects-section {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 28px var(--page-padding) 0;
}

.section-label {
  margin: 0 0 16px;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: lowercase;
  letter-spacing: 0.06em;
}

.prompt {
  color: var(--color-accent);
  margin-right: 6px;
  font-size: 0.82rem;
}

/* ── Divider ── */
.posts-divider {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--page-padding);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  color: var(--color-border);
  user-select: none;
}

/* ── Posts ── */
.posts {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 20px var(--page-padding) 40px;
}

.posts-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-right: 16px;
}

.posts-heading {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: lowercase;
  letter-spacing: 0.06em;
}

.heading-year {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-left: 4px;
}

.search {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-muted);
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.search:focus-within {
  border-color: var(--color-accent);
  background: transparent;
}

.search-icon {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
  opacity: 0.6;
  line-height: 1;
}

.search-input {
  border: none;
  background: transparent;
  color: var(--color-text-primary);
  font-size: 0.75rem;
  font-family: var(--font-mono);
  outline: none;
  width: 90px;
  padding: 0;
}

.search-input::placeholder {
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
  opacity: 0.6;
}

.post-list {
  display: flex;
  flex-direction: column;
}

.empty {
  text-align: center;
  padding: 80px 20px;
  color: var(--color-text-tertiary);
  font-size: 0.85rem;
  font-family: var(--font-mono);
}

@media (max-width: 767px) {
  .hero {
    padding: 40px 16px 24px;
  }

  .hero-title {
    font-size: clamp(2rem, 10vw, 3rem);
  }

  .hero-sub {
    font-size: 0.85rem;
  }

  .posts {
    padding: 16px 16px 64px;
  }

  .posts-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .search-input {
    width: 100%;
    text-align: left;
  }
}
</style>

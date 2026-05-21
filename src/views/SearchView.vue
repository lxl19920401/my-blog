<script setup>
import { ref, computed } from 'vue'
import { searchPosts } from '../utils/posts'
import PostCard from '../components/common/PostCard.vue'

const query = ref('')
const results = computed(() => searchPosts(query.value))

function clearSearch() {
  query.value = ''
}
</script>

<template>
  <div class="search-page">
    <h1 class="page-title">搜索文章</h1>
    <p class="page-desc">输入关键词搜索文章标题、内容或标签</p>

    <div class="search-box">
      <input
        v-model="query"
        type="text"
        class="search-input"
        placeholder="输入关键词..."
        autofocus
      />
      <button v-if="query" class="search-clear" @click="clearSearch">✕</button>
    </div>

    <div v-if="query" class="search-results">
      <p class="result-count">
        共找到 <strong>{{ results.length }}</strong> 篇文章
      </p>

      <div v-if="results.length" class="post-grid">
        <PostCard v-for="post in results" :key="post.slug" :post="post" />
      </div>

      <div v-else class="empty">
        <p>未找到与「<strong>{{ query }}</strong>」相关的文章</p>
        <p class="empty-hint">试试其他关键词</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  max-width: var(--content-width);
  margin: 0 auto;
}

.page-title {
  margin: 0 0 8px;
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--color-text-primary);
}

.page-desc {
  margin: 0 0 32px;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.search-box {
  position: relative;
  margin-bottom: 32px;
}

.search-input {
  width: 100%;
  padding: 14px 40px 14px 18px;
  border: 2px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  font-size: 1rem;
  font-family: inherit;
  outline: none;
  transition: border-color var(--transition-fast);
  box-sizing: border-box;
}

.search-input:focus {
  border-color: var(--color-accent);
}

.search-input::placeholder {
  color: var(--color-text-tertiary);
}

.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
  line-height: 1;
}

.search-clear:hover {
  color: var(--color-text-primary);
}

.result-count {
  margin-bottom: 24px;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--gap);
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-tertiary);
}

.empty-hint {
  font-size: 0.85rem;
  margin-top: 8px;
}

@media (max-width: 767px) {
  .post-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup>
import { computed } from 'vue'
import { siteConfig } from '../../config/site'
import { getAllPosts, getAllTags } from '../../utils/posts'
import TagCloud from '../common/TagCloud.vue'

const stats = computed(() => {
  const posts = getAllPosts()
  const tags = getAllTags()
  const lastUpdated = posts.length > 0 && posts[0]?.date ? posts[0].date.toLocaleDateString('zh-CN') : '—'
  return { postCount: posts.length, tagCount: tags.length, lastUpdated }
})
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-card author-card">
      <div class="author-avatar">
        <img :src="siteConfig.author.avatar" :alt="siteConfig.author.name" />
      </div>
      <h3 class="author-name">{{ siteConfig.author.name }}</h3>
      <p class="author-bio">{{ siteConfig.author.bio }}</p>
    </div>

    <div class="sidebar-card">
      <h4 class="sidebar-title">热门标签</h4>
      <TagCloud :limit="6" />
    </div>

    <div class="sidebar-card stats-card">
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-value">{{ stats.postCount }}</span>
          <span class="stat-label">文章</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-value">{{ stats.tagCount }}</span>
          <span class="stat-label">标签</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-value">{{ stats.lastUpdated }}</span>
          <span class="stat-label">更新</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 12px;
}

.sidebar-title {
  margin: 0 0 8px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-primary);
  padding-bottom: 4px;
  border-bottom: 1px solid var(--color-accent-light);
}

.author-card {
  text-align: center;
  padding: 16px 12px;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 6px;
  border: 2px solid var(--color-accent-light);
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-name {
  margin: 0 0 2px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.author-bio {
  margin: 0;
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  line-height: 1.3;
}

.stats-card {
  padding: 10px 12px;
}

.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-accent);
}

.stat-label {
  display: block;
  font-size: 0.62rem;
  color: var(--color-text-tertiary);
  margin-top: 1px;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: var(--color-border);
}

@media (max-width: 1023px) {
  .sidebar {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
}

@media (max-width: 767px) {
  .sidebar {
    grid-template-columns: 1fr;
  }
}
</style>

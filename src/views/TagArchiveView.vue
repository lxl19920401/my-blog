<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getPostsByTag, getAllTags } from '../utils/posts'
import PostCard from '../components/common/PostCard.vue'
import TagCloud from '../components/common/TagCloud.vue'

const route = useRoute()
const tagName = computed(() => route.params.name)
const allTags = computed(() => getAllTags())

const posts = computed(() => {
  if (tagName.value) {
    return getPostsByTag(tagName.value)
  }
  return []
})
</script>

<template>
  <div class="tag-archive">
    <div v-if="tagName" class="tag-header">
      <h1 class="tag-title">
        标签：<span class="tag-name">{{ tagName }}</span>
      </h1>
      <span class="tag-count">{{ posts.length }} 篇文章</span>
    </div>

    <div v-else class="all-tags-header">
      <h1 class="page-title">所有标签</h1>
      <p class="page-desc">通过标签快速浏览相关文章</p>
    </div>

    <div v-if="!tagName" class="all-tags">
      <div class="tags-card">
        <TagCloud />
      </div>
    </div>

    <div v-if="tagName && posts.length" class="post-grid">
      <PostCard v-for="post in posts" :key="post.slug" :post="post" />
    </div>

    <div v-if="tagName && !posts.length" class="empty">
      <p>该标签下暂无文章</p>
      <router-link to="/tags" class="back-link">查看所有标签</router-link>
    </div>
  </div>
</template>

<style scoped>
.tag-header,
.all-tags-header {
  margin-bottom: 32px;
}

.tag-title,
.page-title {
  margin: 0 0 8px;
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--color-text-primary);
}

.tag-name {
  color: var(--color-accent);
}

.tag-count,
.page-desc {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.all-tags {
  margin-bottom: 40px;
}

.tags-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
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

.back-link {
  color: var(--color-accent);
  text-decoration: none;
}

@media (max-width: 767px) {
  .post-grid {
    grid-template-columns: 1fr;
  }
}
</style>

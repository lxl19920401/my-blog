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
      <h1 class="section-heading"><span class="prompt">❯</span> tag: <span class="tag-name">{{ tagName }}</span></h1>
      <span class="tag-count">{{ posts.length }} posts</span>
    </div>

    <div v-else class="all-tags-header">
      <h1 class="section-heading"><span class="prompt">❯</span> tags</h1>
      <div class="all-tags">
        <TagCloud />
      </div>
    </div>

    <div class="posts-divider" aria-hidden="true">━━━</div>

    <div v-if="tagName && posts.length" class="post-list">
      <PostCard v-for="post in posts" :key="post.slug" :post="post" />
    </div>

    <div v-if="tagName && !posts.length" class="empty">
      <p>no posts for this tag</p>
      <router-link to="/tags" class="back-link">all tags &rarr;</router-link>
    </div>
  </div>
</template>

<style scoped>
.tag-archive {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 40px var(--page-padding) 80px;
}

.tag-header,
.all-tags-header {
  margin-bottom: 16px;
}

.section-heading {
  margin: 0 0 6px;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: lowercase;
  letter-spacing: 0.05em;
}

.prompt {
  color: var(--color-accent);
  margin-right: 6px;
}

.tag-name {
  color: var(--color-accent);
  font-family: var(--font-display);
  font-weight: 700;
}

.tag-count {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
}

.all-tags {
  margin-bottom: 0;
}

.posts-divider {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  color: var(--color-border);
  user-select: none;
  margin-bottom: 20px;
}

.post-list {
  display: flex;
  flex-direction: column;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

.back-link {
  color: var(--color-accent);
  text-decoration: none;
  font-size: 0.85rem;
}
</style>

<script setup>
defineProps({
  post: { type: Object, required: true },
})

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
}
</script>

<template>
  <article class="post-card">
    <router-link :to="`/post/${post.slug}`" class="post-link">
      <div class="post-meta">
        <time v-if="post.date" class="post-date">{{ formatDate(post.date) }}</time>
        <span class="post-reading">{{ post.readingTime }} 分钟</span>
      </div>
      <h2 class="post-title">{{ post.title }}</h2>
      <p v-if="post.description" class="post-desc">{{ post.description }}</p>
      <div v-if="post.tags && post.tags.length" class="post-tags">
        <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
      </div>
    </router-link>
  </article>
</template>

<style scoped>
.post-card {
  border-bottom: 1px solid var(--color-border-light);
  transition: border-color var(--transition-fast);
}

.post-card:hover {
  border-bottom-color: var(--color-accent);
}

.post-link {
  display: block;
  padding: 20px 24px 20px 0;
  text-decoration: none;
  color: inherit;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 0.78rem;
  color: var(--color-text-tertiary);
}

.post-title {
  margin: 0 0 6px;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text-primary);
  transition: color var(--transition-fast);
}

.post-card:hover .post-title {
  color: var(--color-accent);
}

.post-desc {
  margin: 0 0 8px;
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  transition: color var(--transition-fast);
}

.tag:hover {
  color: var(--color-accent);
}
</style>

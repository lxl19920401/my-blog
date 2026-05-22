<script setup>
import { computed } from 'vue'

const props = defineProps({
  post: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

const paddedIndex = computed(() => String(props.index).padStart(3, '0'))

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
}
</script>

<template>
  <article class="post-entry">
    <router-link :to="`/post/${post.slug}`" class="post-link">
      <span class="post-index">{{ paddedIndex }}</span>
      <span class="post-title">{{ post.title }}</span>
      <span class="post-meta">
        <time v-if="post.date" class="post-date">{{ formatDate(post.date) }}</time>
        <span v-if="post.readingTime" class="post-dot">&middot;</span>
        <span v-if="post.readingTime" class="post-reading">{{ post.readingTime }}min</span>
      </span>
      <span class="post-arrow">&rarr;</span>
    </router-link>
  </article>
</template>

<style scoped>
.post-entry {
  border-bottom: 1px solid var(--color-border-light);
  transition: background var(--transition-fast);
}

.post-entry:hover {
  background: var(--color-muted);
}

.post-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  text-decoration: none;
  color: inherit;
}

.post-index {
  flex-shrink: 0;
  width: 36px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-text-tertiary);
}

.post-title {
  flex: 1;
  min-width: 0;
  font-size: 0.9rem;
  font-weight: 450;
  color: var(--color-text-primary);
  transition: color var(--transition-fast);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-entry:hover .post-title {
  color: var(--color-accent);
}

.post-meta {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

.post-dot {
  opacity: 0.5;
}

.post-arrow {
  flex-shrink: 0;
  font-size: 0.85rem;
  color: var(--color-text-tertiary);
  opacity: 0;
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.post-entry:hover .post-arrow {
  opacity: 1;
  transform: translateX(4px);
}

@media (max-width: 767px) {
  .post-link {
    padding: 12px 8px;
    gap: 10px;
  }

  .post-meta {
    display: none;
  }
}
</style>

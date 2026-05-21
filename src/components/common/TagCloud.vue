<script setup>
import { computed } from 'vue'
import { getAllTags } from '../../utils/posts'

const props = defineProps({
  limit: { type: Number, default: 0 },
})

const tags = computed(() => {
  const all = getAllTags()
  return props.limit > 0 ? all.slice(0, props.limit) : all
})
</script>

<template>
  <div class="tag-cloud">
    <router-link
      v-for="tag in tags"
      :key="tag.name"
      :to="`/tag/${tag.name}`"
      class="tag-item"
      :style="{ fontSize: `${Math.max(0.75, Math.min(1.1, 0.7 + tag.count * 0.06))}rem` }"
    >
      {{ tag.name }}
      <span class="tag-count">({{ tag.count }})</span>
    </router-link>
  </div>
</template>

<style scoped>
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 8px;
}

.tag-item {
  display: inline-block;
  padding: 3px 10px;
  color: var(--color-accent);
  background: var(--color-accent-light);
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all var(--transition-fast);
  line-height: 1.4;
}

.tag-item:hover {
  background: var(--color-accent);
  color: #fff;
  transform: translateY(-1px);
}

.tag-count {
  opacity: 0.7;
}
</style>

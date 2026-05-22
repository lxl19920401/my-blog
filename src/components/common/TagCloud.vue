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
      class="tag-pill"
      :style="{ fontSize: `${Math.max(0.78, Math.min(1.05, 0.72 + tag.count * 0.05))}rem` }"
    >
      <span class="tag-hash">#</span>
      {{ tag.name }}
      <span class="tag-count">{{ tag.count }}</span>
    </router-link>
  </div>
</template>

<style scoped>
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px 5px 10px;
  border-radius: 20px;
  background: rgba(129, 140, 248, 0.08);
  border: 1px solid rgba(129, 140, 248, 0.15);
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--transition-fast);
  line-height: 1.4;
}

.tag-pill:hover {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.tag-hash {
  opacity: 0.5;
  font-family: var(--font-mono);
  font-size: 0.85em;
}

.tag-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: rgba(129, 140, 248, 0.15);
  font-size: 0.7rem;
  font-weight: 600;
  font-family: var(--font-mono);
  line-height: 1;
}

.tag-pill:hover .tag-count {
  background: rgba(255, 255, 255, 0.2);
}
</style>

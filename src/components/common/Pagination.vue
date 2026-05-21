<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
})

const emit = defineEmits(['page-change'])

const pages = computed(() => {
  const arr = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(props.totalPages, start + maxVisible - 1)
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  for (let i = start; i <= end; i++) {
    arr.push(i)
  }
  return arr
})
</script>

<template>
  <div v-if="totalPages > 1" class="pagination">
    <button
      :disabled="currentPage <= 1"
      class="page-btn"
      @click="emit('page-change', currentPage - 1)"
    >
      上一页
    </button>

    <button
      v-for="p in pages"
      :key="p"
      class="page-btn"
      :class="{ active: p === currentPage }"
      @click="emit('page-change', p)"
    >
      {{ p }}
    </button>

    <button
      :disabled="currentPage >= totalPages"
      class="page-btn"
      @click="emit('page-change', currentPage + 1)"
    >
      下一页
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 32px;
}

.page-btn {
  padding: 6px 14px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
}

.page-btn:hover:not(:disabled):not(.active) {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.page-btn.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>

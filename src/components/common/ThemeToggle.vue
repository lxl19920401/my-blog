<script setup>
import { useTheme } from '../../composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button class="theme-toggle" :title="isDark ? '切换亮色模式' : '切换暗色模式'" @click="toggleTheme()">
    <span class="icon">{{ isDark ? '☀️' : '🌙' }}</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 1rem;
  line-height: 1;
  padding: 0;
}

.theme-toggle:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-light);
}

.icon {
  display: block;
}
</style>

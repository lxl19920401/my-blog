<script setup>
defineProps({
  project: { type: Object, required: true },
  compact: { type: Boolean, default: false },
})
</script>

<template>
  <a
    v-if="project.url && project.url !== '#'"
    :href="project.url"
    target="_blank"
    rel="noopener noreferrer"
    class="project-chip"
  >
    <span class="chip-name">{{ project.name }}</span>
  </a>
  <span v-else class="project-chip disabled">
    {{ project.name }}
  </span>
</template>

<style scoped>
.project-chip {
  font-size: 0.9rem;
  color: var(--color-text-tertiary);
  text-decoration: none;
  transition: color var(--transition-fast);
  cursor: pointer;
  line-height: 1.5;
}

.project-chip:hover {
  color: var(--color-accent);
}

.project-chip.disabled {
  cursor: default;
}
</style>

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
    class="project-pill"
    :class="project.status"
  >
    <span class="pill-icon">{{ project.icon }}</span>
    {{ project.name }}
  </a>
  <span v-else class="project-pill disabled" :class="project.status">
    <span class="pill-icon">{{ project.icon }}</span>
    {{ project.name }}
  </span>
</template>

<style scoped>
.project-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px 5px 10px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-fast);
  cursor: pointer;
  white-space: nowrap;
}

.project-pill::before {
  content: '';
  font-size: 0.7rem;
  line-height: 1;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.project-pill:hover::before {
  opacity: 1;
}

.project-pill.done::before {
  content: '✓';
}

.project-pill.done {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.2);
}

.project-pill.done:hover {
  background: rgba(74, 222, 128, 0.18);
  cursor: pointer;
}

.project-pill.wip::before {
  content: '◌';
}

.project-pill.wip {
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.2);
}

.project-pill.wip:hover {
  background: rgba(251, 191, 36, 0.18);
  cursor: progress;
}

.project-pill.planning::before {
  content: '✎';
}

.project-pill.planning {
  background: rgba(129, 140, 248, 0.1);
  color: #818cf8;
  border: 1px solid rgba(129, 140, 248, 0.2);
}

.project-pill.planning:hover {
  background: rgba(129, 140, 248, 0.18);
  cursor: crosshair;
}

.project-pill.disabled::before {
  display: none;
}

.project-pill.disabled {
  cursor: default;
  opacity: 0.7;
}

.pill-icon {
  font-size: 0.85rem;
  line-height: 1;
}
</style>

<script setup>
import { siteConfig } from '../../config/site'
import ProjectCard from './ProjectCard.vue'

defineProps({
  compact: { type: Boolean, default: false },
})

const { projects } = siteConfig
</script>

<template>
  <section class="project-section">
    <div class="project-row">
      <ProjectCard v-for="(project, idx) in projects" :key="idx" :project="project" :compact="compact" />
    </div>
  </section>
</template>

<style scoped>
.project-section {
  margin-bottom: 0;
}

.project-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 20px;
}
</style>

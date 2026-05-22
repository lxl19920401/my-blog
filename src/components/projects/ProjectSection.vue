<script setup>
import { siteConfig } from '../../config/site'
import ProjectCard from './ProjectCard.vue'

defineProps({
  compact: { type: Boolean, default: false },
})

const { projects } = siteConfig
</script>

<template>
  <div class="project-toolbelt">
    <ProjectCard v-for="(project, idx) in projects" :key="idx" :project="project" :compact="compact" />
  </div>
</template>

<style scoped>
.project-toolbelt {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>

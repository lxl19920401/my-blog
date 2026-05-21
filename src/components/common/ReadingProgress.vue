<script setup>
import { useReadingProgress } from '../../composables/useReadingProgress'

const { progress } = useReadingProgress()
</script>

<template>
  <div class="reading-progress" :style="{ width: progress + '%' }" />
</template>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-hover));
  z-index: 200;
  transition: width 0.1s linear;
}
</style>

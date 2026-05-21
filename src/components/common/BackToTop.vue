<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <transition name="fade">
    <button v-if="visible" class="back-to-top" title="返回顶部" @click="scrollToTop">
      ↑
    </button>
  </transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 99;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: var(--gradient-primary);
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 0 16px var(--color-accent-glow);
  transition: all var(--transition-normal);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 24px var(--color-accent-glow);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 38px;
    height: 38px;
    font-size: 1rem;
  }
}
</style>

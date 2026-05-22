<script setup>
import { onMounted } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import BackToTop from './components/common/BackToTop.vue'
import { loadApiPosts } from './utils/posts'

onMounted(() => loadApiPosts())
</script>

<template>
  <div class="app-wrapper">
    <AppHeader />
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="slide-up" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
    <BackToTop />
  </div>
</template>

<style scoped>
.app-main {
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}

.app-main::before {
  content: '';
  position: absolute;
  z-index: 0;
  top: -400px;
  right: -300px;
  width: 1200px;
  height: 1400px;
  background: radial-gradient(ellipse 60% 70% at 20% 20%,
    var(--app-glow-start) 0%,
    var(--app-glow-mid) 25%,
    transparent 50%
  );
  filter: blur(80px);
  pointer-events: none;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>

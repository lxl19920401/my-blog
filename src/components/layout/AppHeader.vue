<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { siteConfig } from '../../config/site'
import { useAuth } from '../../composables/useAuth'
import ThemeToggle from '../common/ThemeToggle.vue'

const route = useRoute()
const { isLoggedIn, isAdmin, username, logout } = useAuth()
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 10
}

function handleLogout() {
  logout()
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="app-header" :class="{ scrolled }">
    <div class="header-inner">
      <router-link to="/" class="logo">
        <img :src="siteConfig.logo" alt="logo" class="logo-img" />
        <span class="logo-text">{{ siteConfig.title }}</span>
      </router-link>

      <nav class="nav">
        <router-link
          v-for="item in siteConfig.nav"
          :key="item.link"
          :to="item.link"
          class="nav-link"
          :class="{ active: route.path === item.link }"
        >
          {{ item.text }}
        </router-link>

        <router-link v-if="isLoggedIn && isAdmin" to="/manage" class="nav-link write-link">
          文章管理
        </router-link>
      </nav>

      <div class="header-actions">
        <div v-if="isLoggedIn" class="user-menu">
          <span class="user-name">{{ username }}</span>
          <router-link to="/settings" class="nav-link settings-link">设置</router-link>
          <button class="logout-btn" @click="handleLogout">退出</button>
        </div>
        <router-link v-else to="/login" class="nav-link login-link">登录</router-link>
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: transparent;
  border-bottom: 1px solid transparent;
  backdrop-filter: var(--header-blur);
  -webkit-backdrop-filter: var(--header-blur);
  transition: all var(--transition-normal);
}

.app-header.scrolled {
  background: var(--color-bg-glass);
  border-bottom-color: var(--color-border);
}

.header-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--page-padding);
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--color-text-primary);
  font-weight: 700;
  font-size: 1.1rem;
}

.logo-img {
  width: 28px;
  height: 28px;
  border-radius: 6px;
}

.logo-text {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nav-link {
  position: relative;
  padding: 8px 14px;
  text-decoration: none;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--gradient-primary);
  border-radius: 1px;
  transition: all var(--transition-normal);
  transform: translateX(-50%);
}

.nav-link:hover {
  color: var(--color-text-primary);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 60%;
}

.nav-link.active {
  color: var(--color-accent);
}

.nav-link.active::after {
  width: 60%;
}

.write-link {
  color: var(--color-accent);
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.logout-btn {
  padding: 4px 10px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  color: var(--color-text-tertiary);
  font-size: 0.78rem;
  font-family: inherit;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.logout-btn:hover {
  color: #ef4444;
  border-color: #ef4444;
}

.login-link {
  color: var(--color-accent);
}

@media (max-width: 767px) {
  .header-inner {
    padding: 0 16px;
  }
  .logo-text {
    display: none;
  }
  .user-name {
    display: none;
  }
}
</style>

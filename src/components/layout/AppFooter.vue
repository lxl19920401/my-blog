<script setup>
import { siteConfig } from '../../config/site'
</script>

<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-social">
        <a
          v-for="s in siteConfig.social"
          :key="s.name"
          :href="s.url"
          :title="s.name"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link"
        >
          {{ s.icon === 'github' ? 'GH' : s.icon === 'juejin' ? '掘' : s.icon === 'zhihu' ? '知' : '✉' }}
        </a>
      </div>
      <p class="footer-copy">
        &copy; {{ new Date().getFullYear() }} {{ siteConfig.author.name }}.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  border-top: 1px solid transparent;
  background: transparent;
  position: relative;
}

.app-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  max-width: 400px;
  height: 1px;
  background: var(--gradient-primary);
}

.footer-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 32px var(--page-padding);
  text-align: center;
}

.footer-social {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-fast);
  border: 1px solid var(--color-border);
  backdrop-filter: blur(8px);
}

.social-link:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
  transform: translateY(-2px);
  box-shadow: 0 0 12px var(--color-accent-glow);
}

.footer-copy {
  color: var(--color-text-tertiary);
  font-size: 0.8rem;
  margin: 0;
}
</style>

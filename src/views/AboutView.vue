<script setup>
import { siteConfig } from '../config/site'
</script>

<template>
  <div class="about-page">
    <div class="about-card">
      <div class="about-avatar">
        <img :src="siteConfig.author.avatar" :alt="siteConfig.author.name" />
      </div>
      <h1 class="about-name">{{ siteConfig.author.name }}</h1>
      <p class="about-bio">{{ siteConfig.author.bio }}</p>

      <div class="about-social">
        <a
          v-for="s in siteConfig.social"
          :key="s.name"
          :href="s.url"
          :title="s.name"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link"
        >
          {{ s.name }}
        </a>
      </div>
    </div>

    <div class="about-section">
      <h2 class="section-title">关于本站</h2>
      <p>这是一个基于 Vue 3 + Vite 构建的个人技术博客，专注于记录和分享技术学习过程中的心得与收获。</p>
      <p>本站完全使用 Markdown 写作，所有文章以 <code>.md</code> 文件形式存放，构建为纯静态网站，部署简单快捷。</p>
    </div>

    <div class="about-section">
      <h2 class="section-title">技术栈</h2>
      <div class="tech-list">
        <span class="tech-item">Vue 3</span>
        <span class="tech-item">Vite</span>
        <span class="tech-item">Vue Router</span>
        <span class="tech-item">Marked</span>
        <span class="tech-item">Highlight.js</span>
        <span class="tech-item">CSS Custom Properties</span>
      </div>
    </div>

    <div class="about-section">
      <h2 class="section-title">社交链接</h2>
      <p>你可以通过以下平台找到我：</p>
      <ul class="social-list">
        <li v-for="s in siteConfig.social" :key="s.name">
          <a :href="s.url" target="_blank" rel="noopener noreferrer">{{ s.name }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  max-width: var(--content-width);
  margin: 0 auto;
}

.about-card {
  text-align: center;
  padding: 40px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  margin-bottom: 32px;
}

.about-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 16px;
  border: 3px solid var(--color-accent-light);
}

.about-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.about-name {
  margin: 0 0 8px;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.about-bio {
  margin: 0 0 20px;
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.about-social {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.social-link {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  text-decoration: none;
  color: var(--color-text-secondary);
  font-size: 0.88rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.social-link:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.about-section {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 28px;
  margin-bottom: 20px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--color-accent-light);
}

.about-section p {
  margin: 0 0 12px;
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.about-section code {
  font-family: var(--font-mono);
  font-size: 0.88em;
  padding: 2px 6px;
  background: var(--color-bg-code);
  border-radius: 4px;
  color: var(--color-accent);
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tech-item {
  padding: 4px 14px;
  background: var(--color-accent-light);
  color: var(--color-accent);
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}

.social-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.social-list li {
  margin-bottom: 8px;
}

.social-list a {
  color: var(--color-accent);
  text-decoration: none;
  font-size: 0.95rem;
}

.social-list a:hover {
  text-decoration: underline;
}
</style>

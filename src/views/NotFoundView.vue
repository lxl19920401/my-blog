<script setup>
</script>

<template>
  <div class="not-found">
    <h1 class="code">404</h1>
    <h2 class="title">页面不存在</h2>
    <p class="desc">你访问的页面可能已被移除或地址有误</p>
    <router-link to="/" class="home-link">返回首页</router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 80px 20px;
}

.code {
  font-size: 6rem;
  font-weight: 800;
  color: var(--color-accent);
  margin: 0 0 8px;
  line-height: 1;
  opacity: 0.6;
}

.title {
  margin: 0 0 12px;
  font-size: 1.5rem;
  color: var(--color-text-primary);
}

.desc {
  color: var(--color-text-secondary);
  margin: 0 0 32px;
  font-size: 0.95rem;
}

.home-link {
  display: inline-block;
  padding: 10px 28px;
  background: var(--color-accent);
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: opacity var(--transition-fast);
}

.home-link:hover {
  opacity: 0.9;
}
</style>

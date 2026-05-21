import { assetUrl } from '../utils/path'

export const siteConfig = {
  title: 'MyBlog',
  description: '个人技术博客 - 记录与分享技术、学习与思考',
  logo: assetUrl('vite.svg'),
  url: 'https://your-site.com',

  author: {
    name: '博主',
    avatar: assetUrl('avatar.svg'),
    bio: '热爱技术，专注前端与全栈开发',
  },

  nav: [
    { text: '首页', link: '/' },
    { text: '标签', link: '/tags' },
    { text: '关于', link: '/about' },
  ],

  social: [
    { name: 'GitHub', icon: 'github', url: '#' },
    { name: '掘金', icon: 'juejin', url: '#' },
    { name: '知乎', icon: 'zhihu', url: '#' },
    { name: '邮箱', icon: 'email', url: '#' },
  ],

  projects: [
    {
      name: 'UI 组件库',
      description: '一套轻量级 Vue 3 组件库，包含 30+ 常用组件与工具函数',
      url: '#',
      icon: '🎨',
      category: '前端框架',
      status: 'done',
    },
    {
      name: '工作流引擎',
      description: '可视化工作流编排平台，支持拖拽配置与自动化任务执行',
      url: '#',
      icon: '⚙️',
      category: '工作流平台',
      status: 'wip',
    },
    {
      name: 'CLI 工具集',
      description: '前端项目脚手架与代码生成工具，快速初始化项目模板',
      url: '#',
      icon: '🛠️',
      category: '工具库',
      status: 'done',
    },
    {
      name: '组件文档站',
      description: '基于 VitePress 的交互式组件文档与使用示例站点',
      url: '#',
      icon: '📖',
      category: '前端框架',
      status: 'planning',
    },
    {
      name: 'CI/CD 流水线',
      description: '自动化构建与部署流水线配置，实现一键发布',
      url: '#',
      icon: '🚀',
      category: '工作流平台',
      status: 'wip',
    },
    {
      name: '博客系统',
      description: '本博客系统 — 基于 Vue 3 + Vite 构建的静态个人博客',
      url: '#',
      icon: '📝',
      category: '其他项目',
      status: 'done',
    },
  ],

  pagination: {
    pageSize: 6,
  },
}

import { shallowRef } from 'vue'
import frontmatter from 'front-matter'
import { renderMarkdown, extractHeadings } from './markdown'

const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : ''
const modules = import.meta.glob('/src/posts/*.md', { eager: true })
let cachedPosts = null
let apiLoaded = false
const _trigger = shallowRef(0)

function parseStaticPosts() {
  if (cachedPosts) return cachedPosts

  const posts = []
  for (const [path, mod] of Object.entries(modules)) {
    const content = mod.default || mod
    const slug = path.split('/').pop().replace(/\.md$/, '')
    const { attributes: data, body: markdown } = frontmatter(content)
    const html = renderMarkdown(markdown)
    const headings = extractHeadings(markdown)
    const wordCount = markdown.split(/\s+/).filter(Boolean).length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    posts.push({
      slug,
      title: data.title || slug,
      date: data.date ? new Date(data.date) : null,
      updated: data.updated ? new Date(data.updated) : null,
      tags: data.tags || [],
      description: data.description || '',
      sticky: data.sticky || 0,
      cover: data.cover || null,
      content: markdown,
      html,
      headings,
      readingTime,
      source: 'static',
    })
  }

  posts.sort((a, b) => {
    if (a.sticky !== b.sticky) return b.sticky - a.sticky
    const dateA = a.date ? a.date.getTime() : 0
    const dateB = b.date ? b.date.getTime() : 0
    return dateB - dateA
  })

  cachedPosts = posts
  return posts
}

export async function loadApiPosts() {
  if (apiLoaded) return
  try {
    const res = await fetch(`${API_BASE}/api/posts`)
    const json = await res.json()
    if (!json.success) return
    const apiPosts = json.data.map(p => ({
      slug: p.slug,
      title: p.title,
      date: p.created_at ? new Date(p.created_at) : null,
      updated: p.updated_at ? new Date(p.updated_at) : null,
      tags: p.tags || [],
      description: p.description || '',
      sticky: p.sticky || 0,
      cover: null,
      content: '',
      html: '',
      headings: [],
      readingTime: 1,
      source: 'api',
    }))
    const staticSlugs = new Set(parseStaticPosts().map(p => p.slug))
    const merged = [...parseStaticPosts(), ...apiPosts.filter(p => !staticSlugs.has(p.slug))]
    merged.sort((a, b) => {
      if (a.sticky !== b.sticky) return b.sticky - a.sticky
      const dateA = a.date ? a.date.getTime() : 0
      const dateB = b.date ? b.date.getTime() : 0
      return dateB - dateA
    })
    cachedPosts = merged
    apiLoaded = true
    _trigger.value++
  } catch {
    // API 不可用时仅使用静态文章
  }
}

export function getAllPosts() {
  _trigger.value // reactive dependency
  return parseStaticPosts()
}

export function getPostBySlug(slug) {
  _trigger.value // reactive dependency
  return parseStaticPosts().find(p => p.slug === slug) || null
}

export function getPostsByTag(tag) {
  _trigger.value
  return parseStaticPosts().filter(p => p.tags.includes(tag))
}

export function getAdjacentPosts(slug) {
  _trigger.value
  const posts = parseStaticPosts()
  const idx = posts.findIndex(p => p.slug === slug)
  return {
    prev: idx > 0 ? posts[idx - 1] : null,
    next: idx < posts.length - 1 ? posts[idx + 1] : null,
  }
}

export function getRelatedPosts(slug, max = 3) {
  _trigger.value
  const current = getPostBySlug(slug)
  if (!current) return []
  return parseStaticPosts()
    .filter(p => p.slug !== slug)
    .map(p => ({ ...p, score: p.tags.filter(t => current.tags.includes(t)).length }))
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
}

export function getAllTags() {
  _trigger.value
  const tagMap = new Map()
  parseStaticPosts().forEach(post => {
    post.tags.forEach(tag => tagMap.set(tag, (tagMap.get(tag) || 0) + 1))
  })
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export function searchPosts(query) {
  _trigger.value // reactive dependency
  const q = query.trim().toLowerCase()
  if (!q) return []
  return parseStaticPosts().filter(post =>
    post.title.toLowerCase().includes(q) ||
    post.content.toLowerCase().includes(q) ||
    post.tags.some(tag => tag.toLowerCase().includes(q))
  )
}

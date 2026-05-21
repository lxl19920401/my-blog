import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch {
        return code
      }
    }
    return code
  },
}))

marked.use({
  renderer: {
    heading({ text, depth }) {
      const id = text
        .toLowerCase()
        .replace(/<[^>]*>/g, '')
        .replace(/[^\w\u4e00-\u9fff]+/g, '-')
        .replace(/^-+|-+$/g, '')
      return `<h${depth} id="${id}">${text}</h${depth}>`
    },
    image({ href, title, text }) {
      return `<img src="${href}" alt="${text || ''}" title="${title || ''}" loading="lazy" />`
    },
    link({ href, title, text }) {
      const isExternal = href && href.startsWith('http')
      const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${href}"${attrs}>${text}</a>`
    },
  },
  gfm: true,
  breaks: true,
})

export function extractHeadings(markdown) {
  const regex = /^(#{1,6})\s+(.+)$/gm
  const headings = []
  let match
  while ((match = regex.exec(markdown)) !== null) {
    const text = match[2].trim()
    headings.push({
      depth: match[1].length,
      text,
      id: text
        .toLowerCase()
        .replace(/<[^>]*>/g, '')
        .replace(/[^\w\u4e00-\u9fff]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    })
  }
  return headings
}

export function renderMarkdown(content) {
  return marked.parse(content)
}

export { hljs }

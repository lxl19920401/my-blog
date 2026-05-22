const API = 'http://localhost:3000/api'

const articles = [
  {
    title: '深入理解 Vue 3 响应式系统：从 Proxy 到 ref',
    description: '剖析 Vue 3 响应式原理，理解 reactive、ref、computed 的底层实现机制，以及和 Vue 2 的差异对比。',
    tags: ['Vue', '前端', '响应式编程'],
    content: `## 前言

Vue 3 的响应式系统是基于 ES6 的 Proxy 实现的，它与 Vue 2 的 Object.defineProperty 方案有着本质的区别。

## Proxy 的优势

### 1. 完整的语言特性拦截

Vue 2 无法检测对象属性的添加和删除，而 Proxy 可以拦截几乎所有 JavaScript 对象的操作：

\`\`\`javascript
const handler = {
  get(target, key, receiver) {
    track(target, key)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    trigger(target, key)
    return result
  },
  deleteProperty(target, key) {
    const result = Reflect.deleteProperty(target, key)
    trigger(target, key)
    return result
  }
}
\`\`\`

### 2. 支持 Map、Set 等集合类型

Vue 2 无法直接监听 Map 和 Set 的变化，Vue 3 通过 Proxy 实现了完整的集合类型响应式。

## ref 与 reactive 的选择

- **reactive**：适用于对象类型，自动深度响应
- **ref**：适用于基本类型，也可包装对象，通过 .value 访问

\`\`\`javascript
import { ref, reactive } from 'vue'

const count = ref(0)
const state = reactive({ count: 0 })

console.log(count.value)    // 0
console.log(state.count)    // 0
\`\`\`

## computed 的惰性求值

computed 是基于 effect 实现的懒计算，只有在其依赖变化且被访问时才会重新计算。

## 总结

Vue 3 的响应式系统在性能、能力和可维护性上都大幅超越了 Vue 2。Proxy 的引入使得 Vue 能够更精准地追踪依赖，减少不必要的渲染。`,
  },
  {
    title: 'CSS Container Queries 实战：告别媒体查询依赖',
    description: '容器查询让我们可以根据父容器的大小而非视口来调整样式，是响应式设计的革命性进步。',
    tags: ['CSS', '响应式设计', '前端'],
    content: `## 为什么需要 Container Queries？

传统的媒体查询基于视口（viewport）大小，这在组件化开发中存在明显局限：一个组件在侧边栏和主内容区的表现应该不同，但媒体查询无法区分。

## 基本语法

\`\`\`css
/* 定义容器 */
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* 容器查询 */
@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}

@container card (max-width: 399px) {
  .card {
    display: flex;
    flex-direction: column;
  }
}
\`\`\`

## 实战案例：自适应卡片

\`\`\`css
.card-wrapper {
  container-type: inline-size;
}

.card {
  padding: 1rem;
}

.card__title {
  font-size: clamp(1rem, 4cqi, 2rem);
}

.card__content {
  display: none;
}

@container (min-width: 500px) {
  .card {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 1.5rem;
  }
  .card__content {
    display: block;
  }
}
\`\`\`

## 容器查询单位

- \`cqw\`：容器宽度的 1%
- \`cqh\`：容器高度的 1%
- \`cqi\`：容器内联尺寸的 1%
- \`cqb\`：容器块尺寸的 1%

## 浏览器兼容性

截至 2026 年，Container Queries 已获得所有主流浏览器的广泛支持，可以放心在生产环境中使用。

## 总结

Container Queries 让组件真正做到"一次编写，到处适配"，是 CSS 近年最值得学习的新特性之一。`,
  },
  {
    title: '从零搭建 Monorepo：Turborepo + pnpm 最佳实践',
    description: 'Monorepo 架构在前端工程化中越来越流行，本文介绍如何使用 Turborepo 和 pnpm 搭建高效的多包仓库。',
    tags: ['工程化', 'Monorepo', 'Turborepo', 'pnpm'],
    content: `## 为什么选择 Monorepo？

Monorepo 将多个相关项目放在同一个仓库中管理，带来以下好处：

- 代码共享：公共类型、工具函数、UI 组件无需发布 npm 包
- 统一构建：一条命令构建所有包
- 原子提交：跨包修改在同一个 PR 中完成
- 依赖管理：更少的重复依赖，更少的版本冲突

## 技术选型

### pnpm 的优势

\`\`\`bash
npm install -g pnpm
\`\`\`

pnpm 使用硬链接和符号链接管理 node_modules，节省磁盘空间且安装速度更快。

### Turborepo 的缓存机制

\`\`\`json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**/*.ts", "src/**/*.tsx"]
    },
    "lint": {
      "outputs": []
    }
  }
}
\`\`\`

## 目录结构

\`\`\`
my-monorepo/
├── apps/
│   ├── web/          # Next.js 应用
│   ├── docs/         # 文档站
│   └── admin/        # 管理后台
├── packages/
│   ├── ui/           # 共享 UI 组件
│   ├── utils/        # 工具函数
│   ├── types/        # 共享类型定义
│   └── eslint-config/# ESLint 配置
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
\`\`\`

## 关键配置

\`\`\`yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
\`\`\`

## 总结

Turborepo + pnpm 是目前最推荐的 Monorepo 方案组合，兼顾了性能和开发体验。`,
  },
  {
    title: 'TypeScript 装饰器：从入门到元编程',
    description: '深入理解 TypeScript 装饰器模式，包括类装饰器、方法装饰器、属性装饰器以及元数据反射。',
    tags: ['TypeScript', '装饰器', '元编程'],
    content: `## 装饰器是什么？

装饰器是一种特殊类型的声明，可以附加到类、方法、访问器、属性或参数上。它以 @expression 的形式使用，其中 expression 是一个在运行时被调用的函数。

## 启用装饰器

\`\`\`json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
\`\`\`

## 类装饰器

\`\`\`typescript
function sealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@sealed
class BugReport {
  type = 'report'
  title: string
}
\`\`\`

## 方法装饰器

\`\`\`typescript
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value
  descriptor.value = function(...args: any[]) {
    console.log(\`Calling \${propertyKey} with\`, args)
    return original.apply(this, args)
  }
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b
  }
}
\`\`\`

## 属性装饰器与 Reflect Metadata

\`\`\`typescript
import 'reflect-metadata'

function validate(target: any, propertyKey: string) {
  const existing = Reflect.getOwnMetadata('validators', target) || []
  existing.push(propertyKey)
  Reflect.defineMetadata('validators', existing, target)
}

class User {
  @validate
  email!: string

  @validate
  name!: string
}
\`\`\`

## 总结

装饰器为 TypeScript 带来了强大的元编程能力，在框架开发、AOP 编程、依赖注入等场景中发挥着重要作用。`,
  },
  {
    title: '算法：前缀和与差分数组的妙用',
    description: '前缀和与差分数组是解决区间查询和区间修改问题的高效工具，掌握它们能让你的算法能力提升一个台阶。',
    tags: ['算法', '数据结构', '编程'],
    content: `## 前缀和

### 一维前缀和

\`\`\`cpp
vector<int> prefixSum(vector<int>& nums) {
    int n = nums.size()
    vector<int> pre(n + 1, 0)
    for (int i = 0; i < n; i++) {
        pre[i + 1] = pre[i] + nums[i]
    }
    return pre
}
// 区间 [l, r] 的和：pre[r+1] - pre[l]
\`\`\`

### 二维前缀和

\`\`\`cpp
vector<vector<int>> prefixSum2D(vector<vector<int>>& matrix) {
    int m = matrix.size(), n = matrix[0].size()
    vector<vector<int>> pre(m + 1, vector<int>(n + 1, 0))
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            pre[i][j] = pre[i-1][j] + pre[i][j-1] - pre[i-1][j-1] + matrix[i-1][j-1]
        }
    }
    return pre
}
// 子矩阵 (r1,c1) 到 (r2,c2) 的和：
// pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1]
\`\`\`

## 差分数组

差分是前缀和的逆运算，适用于频繁的区间增减操作。

\`\`\`cpp
class Difference {
    vector<int> diff
public:
    Difference(vector<int>& nums) {
        int n = nums.size()
        diff.resize(n)
        diff[0] = nums[0]
        for (int i = 1; i < n; i++) {
            diff[i] = nums[i] - nums[i-1]
        }
    }

    void increment(int l, int r, int val) {
        diff[l] += val
        if (r + 1 < diff.size()) {
            diff[r + 1] -= val
        }
    }

    vector<int> result() {
        vector<int> res(diff.size())
        res[0] = diff[0]
        for (int i = 1; i < diff.size(); i++) {
            res[i] = res[i-1] + diff[i]
        }
        return res
    }
}
\`\`\`

## 典型题目

1. LeetCode 303 — 区域和检索
2. LeetCode 304 — 二维区域和检索
3. LeetCode 1109 — 航班预订统计
4. LeetCode 1094 — 拼车

## 总结

前缀和与差分数组是算法面试中的高频考点，适合处理静态数组的区间查询和动态数组的区间修改问题。`,
  },
  {
    title: '浏览器渲染流水线：从 HTML 到像素',
    description: '理解浏览器的渲染流程对于前端性能优化至关重要，本文详细解析关键渲染路径的每个阶段。',
    tags: ['浏览器', '性能优化', '渲染'],
    content: `## 关键渲染路径

浏览器将 HTML、CSS 和 JavaScript 转换为屏幕上的像素，经历以下步骤：

1. **DOM 树构建**：解析 HTML
2. **CSSOM 树构建**：解析 CSS
3. **渲染树构建**：合并 DOM 和 CSSOM
4. **布局**：计算几何信息
5. **绘制**：填充像素
6. **合成**：分层合成

## 构建流程详解

### DOM 树

\`\`\`html
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div>Hello</div>
</body>
</html>
\`\`\`

### 回流与重绘

| 操作 | 触发回流 | 触发重绘 |
|------|---------|---------|
| 改变 width/height | ✅ | ✅ |
| 改变 color | ❌ | ✅ |
| 改变 transform | ❌ | ❌（仅合成） |

\`\`\`javascript
// 坏实践：强制同步布局
for (let i = 0; i < 1000; i++) {
  const height = element.offsetHeight  // 读取
  element.style.height = height + 1 + 'px'  // 写入
}

// 好实践：批量读写
const heights = []
for (let i = 0; i < 1000; i++) {
  heights.push(element.offsetHeight)
}
for (let i = 0; i < 1000; i++) {
  element.style.height = heights[i] + 1 + 'px'
}
\`\`\`

## 性能优化建议

1. **使用 transform 和 opacity 进行动画**：它们只触发合成
2. **减少 DOM 深度**：简化选择器
3. **避免强制同步布局**：批量读写
4. **使用 content-visibility**：延迟渲染屏外内容

## 总结

掌握渲染流水线是前端性能优化的基本功，理解回流、重绘和合成的区别能帮助你写出更流畅的页面。`,
  },
  {
    title: 'Rust 所有权系统：写给前端开发者的入门指南',
    description: '用前端开发者熟悉的 JavaScript 概念类比，轻松理解 Rust 的所有权、借用和生命周期。',
    tags: ['Rust', '系统编程', '前端'],
    content: `## 从 JS 到 Rust

作为前端开发者，你可能觉得 Rust 的学习曲线很陡峭。但事实上，很多概念都能从 JavaScript 中找到对应。

## 所有权规则

1. Rust 中每个值都有一个所有者
2. 同一时间只能有一个所有者
3. 所有者离开作用域时值被释放

### Move 语义

\`\`\`rust
let s1 = String::from("hello")
let s2 = s1  // s1 的所有权移动到 s2

// println!("{}", s1)  // 编译错误！s1 已失效
\`\`\`

这就好比 JavaScript 中，当你把一个对象赋值给新变量时，两个变量引用同一个对象。但在 Rust 中，旧变量会被立即失效。

### Borrow 借用

\`\`\`rust
fn calculate_length(s: &String) -> usize {
    s.len()
}

let s1 = String::from("hello")
let len = calculate_length(&s1)  // 借用，不移交所有权
println!("{} length: {}", s1, len)  // 正常工作
\`\`\`

## 生命周期

\`\`\`rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
\`\`\`

生命周期注解告诉编译器：返回值的引用在传入参数的引用的有效期内有效。

## 总结

所有权系统是 Rust 最独特也最强大的特性。它让 Rust 无需垃圾回收器就能保证内存安全。虽然刚开始会觉得不适应，但一旦掌握，你会发现它让代码更加健壮和可预测。`,
  },
  {
    title: 'Web 性能指标全解读：LCP、FID、CLS 与 INP',
    description: 'Core Web Vitals 是 Google 的核心性能评估标准，了解这些指标是做好性能优化的第一步。',
    tags: ['性能优化', 'Web', 'Core Web Vitals'],
    content: `## Core Web Vitals 概览

Google 的 Core Web Vitals 是衡量用户体验的关键指标：

| 指标 | 全称 | 衡量内容 | 阈值 |
|------|------|---------|------|
| LCP | Largest Contentful Paint | 加载性能 | < 2.5s |
| INP | Interaction to Next Paint | 交互响应 | < 200ms |
| CLS | Cumulative Layout Shift | 视觉稳定性 | < 0.1 |

## LCP：最大内容绘制

衡量从页面开始加载到最大文本块或图像完成渲染的时间。

### 优化策略

\`\`\`html
<!-- 预加载关键资源 -->
<link rel="preload" href="hero.webp" as="image">
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- 优化图片 -->
<img src="photo.webp" 
     srcset="photo-400.webp 400w, photo-800.webp 800w"
     sizes="(max-width: 600px) 400px, 800px"
     loading="lazy"
     fetchpriority="high">
\`\`\`

## INP：交互到下一帧

取代了 FID（First Input Delay），衡量页面交互的整体响应能力。

### 优化策略

\`\`\`javascript
// 避免长任务
function processData(data) {
  const chunkSize = 50
  let index = 0

  function processChunk() {
    const chunk = data.slice(index, index + chunkSize)
    chunk.forEach(item => heavyWork(item))
    index += chunkSize

    if (index < data.length) {
      requestAnimationFrame(processChunk)
    }
  }

  processChunk()
}
\`\`\`

## CLS：累积布局偏移

衡量页面内容的视觉稳定性。

### 优化策略

\`\`\`css
/* 为动态内容预留空间 */
img, video, iframe {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
}

.ad-placeholder {
  min-height: 250px;
  background: #f0f0f0;
}
\`\`\`

## 总结

Core Web Vitals 直接影响了 SEO 排名和用户体验。持续监控并优化这些指标应该成为每个前端团队的日常工作。`,
  },
  {
    title: '设计模式在 TypeScript 中的现代实践',
    description: '用 TypeScript 的类型系统和泛型重新诠释经典设计模式，写出更简洁、更安全的代码。',
    tags: ['设计模式', 'TypeScript', '架构'],
    content: `## 策略模式

### 传统实现

\`\`\`typescript
interface Strategy {
  execute(a: number, b: number): number
}

class AddStrategy implements Strategy {
  execute(a: number, b: number) { return a + b }
}

class MultiplyStrategy implements Strategy {
  execute(a: number, b: number) { return a * b }
}

class Calculator {
  constructor(private strategy: Strategy) {}
  calculate(a: number, b: number) {
    return this.strategy.execute(a, b)
  }
}
\`\`\`

### 函数式简化

在 TypeScript 中，策略可以退化为纯函数：

\`\`\`typescript
type CalculationStrategy = (a: number, b: number) => number

const add: CalculationStrategy = (a, b) => a + b
const multiply: CalculationStrategy = (a, b) => a * b

class Calculator {
  constructor(private strategy: CalculationStrategy) {}
  calculate(a: number, b: number) {
    return this.strategy(a, b)
  }
}
\`\`\`

## 观察者模式

\`\`\`typescript
type Listener<T> = (event: T) => void

class EventEmitter<T> {
  private listeners: Set<Listener<T>> = new Set()

  on(listener: Listener<T>) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  emit(event: T) {
    this.listeners.forEach(l => l(event))
  }
}
\`\`\`

## 工厂模式与依赖注入

\`\`\`typescript
interface Database {
  query(sql: string): Promise<any[]>
}

class MySQLDatabase implements Database {
  async query(sql: string) {
    return await mysql.query(sql)
  }
}

class PostgresDatabase implements Database {
  async query(sql: string) {
    return await pg.query(sql)
  }
}

class UserRepository {
  constructor(private db: Database) {}

  async findById(id: number) {
    return await this.db.query(\`SELECT * FROM users WHERE id = \${id}\`)
  }
}
\`\`\`

## 总结

TypeScript 的类型系统让我们可以用更少的代码实现设计模式的意图。理解模式背后的思想比记忆具体实现更重要。`,
  },
  {
    title: '现代 CSS 中的 :has() 选择器：父元素选择器来了',
    description: ':has() 选择器被誉为 CSS 选择器的革命，它终于让我们能根据子元素来选择父元素了。',
    tags: ['CSS', '选择器', '前端'],
    content: `## :has() 是什么？

:has() 是 CSS 选择器级别 4 中最重要的新增特性之一。它让我们能够根据子元素或后续兄弟元素的存在来选择元素。

\`\`\`css
/* 选择包含 img 的 figure */
figure:has(img) {
  background: #f0f0f0;
  padding: 1rem;
}

/* 选择包含 .error 类子元素的表单 */
form:has(.error) {
  border-color: red;
}
\`\`\`

## 实战场景

### 1. 卡片布局调整

\`\`\`css
/* 没有图片的卡片用不同的布局 */
.card:not(:has(img)) {
  text-align: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

/* 有多个子项的卡片 */
.card:has(.tag:nth-child(n+3)) {
  grid-column: span 2;
}
\`\`\`

### 2. 表单验证状态

\`\`\`css
.input-group:has(input:focus) {
  outline: 2px solid blue;
  border-radius: 4px;
}

.input-group:has(input:invalid:not(:placeholder-shown)) {
  outline: 2px solid red;
}

.input-group:has(input:invalid) .error-message {
  display: block;
}
\`\`\`

### 3. 响应式导航

\`\`\`css
/* 导航项过多时切换为汉堡菜单 */
nav:has(> .nav-item:nth-child(n+6)) .menu-toggle {
  display: block;
}

nav:has(> .nav-item:nth-child(n+6)) .nav-list {
  display: none;
}
\`\`\`

## 性能考虑

虽然 :has() 功能强大，但也要注意：

- 避免在性能关键路径上使用复杂的 :has() 选择器
- 嵌套过深的 :has() 可能导致性能下降
- 优先使用简单的 :has(img)、:has(.error) 等

## 总结

:has() 选择器填补了 CSS 中"父元素选择器"的空白，让很多原本需要 JavaScript 才能实现的交互变得纯 CSS 化。`,
  },
]

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  try {
    // 1. Login
    console.log('🔑 登录中...')
    const loginRes = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' }),
    })
    const loginData = await loginRes.json()
    if (!loginData.success) {
      console.error('❌ 登录失败:', loginData.message)
      return
    }
    const token = loginData.data.token
    console.log('✅ 登录成功')

    // 2. Get existing posts
    console.log('📋 获取现有文章...')
    const postsRes = await fetch(`${API}/posts`)
    const postsData = await postsRes.json()
    const existingPosts = postsData.data || []
    console.log(`   共 ${existingPosts.length} 篇文章`)

    // 3. Delete all existing posts
    if (existingPosts.length > 0) {
      console.log('🗑️ 删除现有文章...')
      for (const post of existingPosts) {
        const delRes = await fetch(`${API}/posts/${post.slug}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
        const delData = await delRes.json()
        if (delData.success) {
          console.log(`   ✅ 已删除: ${post.title}`)
        } else {
          console.log(`   ❌ 删除失败: ${post.title} - ${delData.message}`)
        }
        await sleep(200)
      }
    }

    // 4. Create new articles
    console.log('✍️  创建新文章...')
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i]
      console.log(`   [${i + 1}/${articles.length}] ${article.title}`)

      const createRes = await fetch(`${API}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: article.title,
          content: article.content,
          description: article.description,
          tags: article.tags,
          sticky: i === 0 ? 1 : 0,
        }),
      })
      const createData = await createRes.json()
      if (createData.success) {
        console.log(`      ✅ 创建成功`)
      } else {
        console.log(`      ❌ 创建失败: ${createData.message}`)
      }
      await sleep(300)
    }

    console.log('🎉 全部完成！')
  } catch (err) {
    console.error('💥 脚本出错:', err.message)
  }
}

main()

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/post/:slug',
    name: 'PostDetail',
    component: () => import('../views/PostDetailView.vue'),
  },
  {
    path: '/tags',
    name: 'Tags',
    component: () => import('../views/TagArchiveView.vue'),
  },
  {
    path: '/tag/:name',
    name: 'TagPosts',
    component: () => import('../views/TagArchiveView.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/SearchView.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue'),
  },
  {
    path: '/manage',
    name: 'Manage',
    component: () => import('../views/ArticleManage.vue'),
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('../views/EditorView.vue'),
  },
  {
    path: '/editor/:slug',
    name: 'EditorEdit',
    component: () => import('../views/EditorView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory('/my-blog/'),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router

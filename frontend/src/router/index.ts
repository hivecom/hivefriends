import { createRouter, createWebHistory } from 'vue-router'

import UserAlbums from '../components/user/UserAlbums.vue'
import UserImages from '../components/user/UserImages.vue'
import UserProfile from '../components/user/UserProfile.vue'
import UserSettings from '../components/user/UserSettings.vue'
// Navigation guards
import beforeResolve from './guards/beforeResolve'
import About from './views/About.vue'
import Activity from './views/Activity.vue'
import AlbumDetail from './views/AlbumDetail.vue'
import AlbumEdit from './views/AlbumEdit.vue'
import AlbumList from './views/AlbumList.vue'
import AlbumUpload from './views/AlbumUpload.vue'

import Feed from './views/Feed.vue'
import Home from './views/Home.vue'
import ImageDetail from './views/ImageDetail.vue'

// Subchildren for user pages

import Login from './views/Login.vue'

/**
 * Router Setup
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'Login' },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: 'Sign In',
        redirectOnAuth: '/home',
        disableNav: true,
        requiresAuth: false,
      },
    },
    {
      path: '/feed',
      name: 'Feed',
      component: Feed,
      meta: {
        title: 'Image Feed',
        requiresAuth: true,
      },
    },
    {
      path: '/about',
      name: 'About',
      component: About,
      meta: {
        title: 'About us',
        requiresAuth: true,
      },
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home',
        requiresAuth: true,
      },
    },
    {
      path: '/albums',
      name: 'Albums',
      component: AlbumList,
      meta: {
        title: 'All Albums',
        requiresAuth: true,
      },
    },
    {
      path: '/album/:id',
      name: 'AlbumDetail',
      component: AlbumDetail,
      meta: {
        title: 'Album Detail',
        requiresAuth: true,
      },
    },
    {
      path: '/public/album/:id/:token',
      name: 'PublicAlbumDetail',
      component: AlbumDetail,
      meta: {
        title: 'Album Detail',
        disableNav: true,
        requiresAuth: false,
      },
    },
    {
      path: '/album/:album/image/:image',
      name: 'ImageDetail',
      component: ImageDetail,
      meta: {
        title: 'Image Detail',
        disableNav: true,
        requiresAuth: true,
      },
    },
    {
      path: '/public/album/:album/image/:image/:token',
      name: 'PublicImageDetail',
      component: ImageDetail,
      meta: {
        title: 'Image Detail',
        disableNav: true,
        requiresAuth: false,
      },
    },
    {
      path: '/upload/album',
      name: 'Upload',
      component: AlbumUpload,
      props: true,
      meta: {
        title: 'Upload',
        requiresAuth: true,
      },
    },
    {
      path: '/edit/album/:id',
      name: 'AlbumEdit',
      component: AlbumEdit,
      props: true,
      meta: {
        title: 'Edit',
        requiresAuth: true,
      },
    },
    {
      path: '/:user',
      name: 'UserProfile',
      component: UserProfile,
      meta: {
        title: 'User Profile',
        requiresAuth: true,
      },
    },
    {
      path: '/user/settings',
      name: 'UserSettings',
      component: UserSettings,
      meta: {
        title: 'User Settings',
        requiresAuth: true,
      },
    },
    {
      path: '/:user/albums',
      name: 'UserAlbums',
      component: UserAlbums,
      meta: {
        title: 'User Albums',
        requiresAuth: true,
      },
    },
    {
      path: '/user/images',
      name: 'UserImages',
      component: UserImages,
      meta: {
        title: 'User Images',
        requiresAuth: true,
      },
    },
    {
      path: '/activity',
      name: 'RouteActivity',
      component: Activity,
      meta: {
        title: 'User Acitvity',
        requiresAuth: true,
      },
    },
  ],
})

/**
 * Router Guards
 */

router.beforeResolve(beforeResolve)

export default router

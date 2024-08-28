import { createRouter, createWebHistory } from 'vue-router';
import Signup from '@/components/Signup.vue';
import Login from '@/components/Login.vue';
import Home from '@/components/Home.vue';
import SavedLocations from '@/components/SavedLocations.vue';
import WeatherHistory from '@/components/WeatherHistory.vue';
import authService from '@/services/authService';

const routes = [
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path : '/home',
    name : 'Home',
    component : Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/saved-locations',
    name: 'SavedLocations',
    component: SavedLocations,
    meta: { requiresAuth: true }
  },
  { path: '/weather-history',
    name: 'WeatherHistory',
    component: WeatherHistory,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authService.isAuthenticated()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});




export default router;

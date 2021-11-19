import Vue from 'vue';
import VueRouter from 'vue-router';
import i18n from '../i18n';
import store from '../store';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import About from '../views/About.vue';
import UserManagement from '../views/UserManagement.vue';
import UserProfile from '../views/UserProfile.vue';
import Unauthorized from '../views/Unauthorized.vue';

import Capabilities from '../Capabilities';

Vue.use(VueRouter);

//
// to silence annoying duplicate router push
//
const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

const routes = [
  {
    path: '/',
    name: i18n.t('dashboard.name'),
    component: Dashboard,
    meta: {
      requiresAuth: true,
      cap: 0,
    },
  },
  {
    path: '/login',
    name: i18n.t('login.name'),
    component: Login,
    meta: {
      cap: 0,
    },
  },
  {
    path: '/about',
    name: i18n.t('about.name'),
    component: About,
    meta: {
      requiresAuth: true,
      cap: 0,
    },
  },
  {
    path: '/user_management',
    name: i18n.t('userMgmt.name'),
    component: UserManagement,
    meta: {
      requiresAuth: true,
      cap: Capabilities.CapUserManagement,
    },
  },
  {
    path: '/user_profile',
    name: i18n.t('userProfile.name'),
    component: UserProfile,
    meta: {
      requiresAuth: true,
      cap: 0,
    },
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: Unauthorized,
    meta: {
      requiresAuth: false,
      cap: 0,
    },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  /*
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next('/login');
  } else {
    next();
  }
  */
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      if (to.matched.some((record) => (record.meta.cap === 0 || store.getters.caps(record.meta.cap) === true))) {
        next();
        return;
      }
      next('/unauthorized');
      return;
    }
    next('/login');
  } else {
    next();
  }
});

export default router;

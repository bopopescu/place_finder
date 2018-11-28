import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import UserPage from '@/components/UserPage'
import AllContentPage from '@/components/AllContentPage'
import SearchResults from '@/components/SearchResults'
import UserResults from '@/components/UserResults'

import store from '../store'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/content',
      name: 'AllContentPage',
      component: AllContentPage

    },
    {
      path: '/search',
      name: 'SearchResults',
      component: SearchResults
    },
    {
      path: '/userfeed',
      name: 'UserResults',
      component: UserResults
    },
    {
      path: '/user',
      name: 'UserPage',
      component: UserPage,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

if (store.state.user) {
  router.push({
    path: '/content'
  });
}

router.beforeEach(async (to, from, next) => {
  let currentUser = store.state.user;
  console.log(currentUser);
  let requriesAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requriesAuth && !currentUser) {
    //await store.dispatch('login');
    next('/')
  } else {
    next()
  }
})

export default router;

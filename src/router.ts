import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import PlayerSummary from './views/PlayerSummary.vue';
import SalmonResult from './views/SalmonResult.vue';
import SalmonResultUploader from './views/SalmonResultUploader.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/results/:resultId([1-9]\\d*)',
      name: 'result',
      component: SalmonResult,
    },
    {
      path: '/upload',
      name: 'upload',
      component: SalmonResultUploader,
    },
    {
      path: '/players/:playerId([a-f\\d]{16})',
      name: 'playerSummary',
      component: PlayerSummary,
    },
    { // Fallback route
      path: '*',
      component: Home,
      redirect: '/',
    },
  ],
});

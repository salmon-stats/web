import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import LatestResults from './views/LatestResults.vue';
import PlayerSummary from './views/PlayerSummary.vue';
import PlayerResults from './views/PlayerResults.vue';
import SalmonResult from './views/SalmonResult.vue';
import SalmonResultUploader from './views/SalmonResultUploader.vue';
import ScheduleSummary from './views/ScheduleSummary.vue';

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
      path: '/results',
      name: 'results',
      component: LatestResults,
    },
    {
      path: '/results/:resultId([1-9]\\d*)',
      name: 'results.detail',
      component: SalmonResult,
    },
    {
      path: '/upload',
      name: 'upload',
      component: SalmonResultUploader,
    },
    {
      path: '/players/:playerId([a-f\\d]{16})',
      name: 'players.summary',
      component: PlayerSummary,
    },
    {
      path: '/players/:playerId([a-f\\d]{16})/results',
      name: 'players.results',
      component: PlayerResults,
    },
    {
      path: '/schedules/:scheduleId(\\d{10})',
      name: 'schedules.summary',
      component: ScheduleSummary,
    },
    { // Fallback route
      path: '*',
      component: Home,
      redirect: '/',
    },
  ],
});

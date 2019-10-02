import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import LatestResults from './views/LatestResults.vue';
import PlayerBase from './views/PlayerBase.vue';
import PlayerShifts from './views/PlayerShifts.vue';
import PlayerShiftSummary from './views/PlayerShiftSummary.vue';
import PlayerSummary from './views/PlayerSummary.vue';
import PlayerResults from './views/PlayerResults.vue';
import SalmonResult from './views/SalmonResult.vue';
import SalmonResultUploader from './views/SalmonResultUploader.vue';
import Schedules from './views/Schedules.vue';
import ScheduleBase from './views/ScheduleBase.vue';
import ScheduleSummary from './views/ScheduleSummary.vue';
import ScheduleResults from './views/ScheduleResults.vue';

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
      name: 'results.summary',
      component: SalmonResult,
    },
    {
      path: '/upload',
      name: 'upload',
      component: SalmonResultUploader,
    },
    {
      path: '/players/:playerId([a-f\\d]{16}|@\\w{1,15})',
      component: PlayerBase,
      children: [
        {
          path: 'results',
          name: 'players.results',
          component: PlayerResults,
        },
        {
          path: 'results/:resultId(latest)',
          name: 'players.results.latest',
          component: SalmonResult,
        },
        {
          path: 'schedules',
          name: 'players.schedules',
          component: PlayerShifts,
        },
        {
          path: 'schedules/:scheduleId(\\d{10})',
          name: 'players.schedules.summary',
          component: PlayerShiftSummary,
        },
        {
          path: '',
          name: 'players.summary',
          component: PlayerSummary,
        },
      ],
    },
    {
      path: '/schedules',
      name: 'schedules',
      component: Schedules,
    },
    {
      path: '/schedules/:scheduleId(\\d{10})',
      component: ScheduleBase,
      children: [
        {
          path: '',
          name: 'schedules.summary',
          component: ScheduleSummary,
        },
        {
          path: '/schedules/:scheduleId(\\d{10})/results',
          name: 'schedules.results',
          component: ScheduleResults,
        },
      ],
    },
    { // Fallback route
      path: '*',
      component: Home,
      redirect: '/',
    },
  ],
});

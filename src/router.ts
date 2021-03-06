import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import LatestResults from './views/LatestResults.vue';
import PlayerBase from './views/PlayerBase.vue';
import PlayerSearch from './views/PlayerSearch.vue';
import PlayerShifts from './views/PlayerShifts.vue';
import PlayerShiftSummary from './views/PlayerShiftSummary.vue';
import PlayerSummary from './views/PlayerSummary.vue';
import PlayerResults from './views/PlayerResults.vue';
import SalmonResult from './views/SalmonResult.vue';
import Schedules from './views/Schedules.vue';
import ScheduleBase from './views/ScheduleBase.vue';
import ScheduleSummary from './views/ScheduleSummary.vue';
import ScheduleResults from './views/ScheduleResults.vue';
import Settings from './views/Settings.vue';

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
      // Currently there are no visible link to this route.
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
      redirect: 'settings',
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/players/search',
      name: 'players.search',
      component: PlayerSearch,
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
          path: 'schedules/:scheduleId(\\d{10})/results',
          name: 'players.schedules.results',
          component: PlayerResults,
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
    {
      // Fallback route
      path: '*',
      component: Home,
      redirect: '/',
    },
  ],
});

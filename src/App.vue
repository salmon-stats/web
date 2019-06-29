<template>
  <div id="app">
    <header>
      <global-header />
    </header>
    <router-view />
  </div>
</template>

<style lang="scss">
body {
  background-color: darken(#2c3e50, 10%);
  color: #ecf0f1;
}
a {
  font-weight: bold;
  color: #1ddbb4;
}

table, tr, td {
  border-collapse: collapse;
  border: 0;
}
th {
  text-align: left;
  padding: .125em .5em;
}
td {
  padding: .375em .5em;
}
.table-wrap {
  display: inline-block;
  padding: .25em;
  background-color: lighten(#2c3e50, 5%);
}
tbody tr:nth-child(odd) {
  background-color: lighten(#2c3e50, 2.5%);
}
tbody tr:nth-child(even) {
  background-color: #2c3e50;
}
table.is-hoverable tbody tr:hover {
  background-color: lighten(#2c3e50, 10%);
}

.clickable {
  cursor: pointer;
}
</style>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import GlobalHeader from './components/GlobalHeader.vue';
import { metadataModule } from './store/modules/metadata';

@Component({
  name: 'App',
  components: { GlobalHeader },
})
export default class App extends Vue {
  mounted() {
    const timerId = setInterval(() => {
      const now = new Date().getTime();
      if (now > metadataModule.lastFetchedTime + SESSION_REFRESH_TIME) {
        metadataModule.refreshSession()
          .then(() => {
            if (metadataModule.hasSessionExpired) {
              clearInterval(timerId);
            }
          });
      }
    }, 60000);
  }
}
</script>

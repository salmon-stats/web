<template>
  <div id="app" class="container">
    <header>
      <global-header />
    </header>
    <router-view />

    <footer>
      <global-footer />
    </footer>
  </div>
</template>

<style lang="scss">
@import '@/assets/bulma.scss';

$footer-height: 5em;

#app {
  min-height: 100vh;
  padding-bottom: $footer-height;
}

footer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  height: $footer-height;
}

table, tr, td {
  border-collapse: collapse;
  border: 0;
}
th, td {
  vertical-align: middle !important; // TODO
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

.golden-egg {
  color: $golden-egg;
}
.power-egg {
  color: $power-egg;
}

.clear {
  color: greenyellow;
}
.fail {
  color: orange;
}
</style>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import GlobalHeader from './components/GlobalHeader.vue';
import GlobalFooter from './components/GlobalFooter.vue';
import { metadataModule } from './store/modules/metadata';

@Component({
  name: 'App',
  components: { GlobalHeader, GlobalFooter },
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

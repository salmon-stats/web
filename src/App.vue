<template>
  <div id="app" class="container">
    <header>
      <global-header />
    </header>

    <router-view class="body" />

    <footer>
      <global-footer />
    </footer>
  </div>
</template>

<style lang="scss">
@import '@/assets/bulma.scss';

$footer-height: 5em;

h1, h2, h3, h4, h5, h6 {
  font-weight: bold;
  color: $text-strong;
}

h2 {
  font-size: 120%;
  margin-bottom: .5em;
  &.has-margin-top {
    margin-top: .5em;
  }
}

#app {
  min-height: 100vh;
  padding-bottom: $footer-height;
}

#app > .body {
  margin-top: 1em;
}

.has-title[title] {
  text-decoration: underline;
  text-decoration-style: dotted;
}

.weak {
  color: darken($text, 5%);
}


@media screen and (max-width: $tablet - 1) {
  #app > .body {
    padding-left: 1em;
    padding-right: 1em;
  }
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
:not(.table) {
  th {
    text-align: left;
    padding: .125em .5em !important;
  }
  td {
    padding: .25em .5em !important;
  }
}
.table-wrap {
  display: inline-block;
  background-color: darken($background, 5%);

  @media screen and (min-width: $tablet) {
    padding: .25em;
  }
  @media screen and (max-width: $tablet - 1) {
    &.box { padding: .25em 0; }
    thead tr { border-bottom: 1px solid darken($background, 7.5%); }
    tfoot tr { border-top: 1px solid darken($background, 7.5%); }
  }
}
tbody tr:nth-child(odd) {
  background-color: $background;
}
tbody tr:nth-child(even) {
  background-color: darken($background, 2.5%);
}
table.is-hoverable tbody tr:hover {
  background-color: lighten($background, 5%);
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

.max-hazard {
  color: $death;
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

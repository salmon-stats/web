<template>
  <div id="app" class="container">
    <header>
      <global-header />
    </header>

    <router-view class="body" />

    <footer>
      <global-footer />
    </footer>

    <confirmation-dialog ref="confirm" />

    <div v-if="isDev" class="p-4" style="position: fixed; bottom: 0; right: 0;">
      <a target="_blank" :href="productionLink">[Open in Production]</a>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/bulma.scss';

$footer-height: 5em;

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: bold;
  color: $text-strong;
}

h2 {
  font-size: 120%;
  margin-bottom: 0.5em;
  &.has-margin-top {
    margin-top: 0.5em;
  }
}

#app {
  min-height: 100vh;
  padding-bottom: $footer-height;
}

#app > .body {
  margin-top: 1em;
}

.is-fullwidth {
  width: 100%;
}

.pseudo-link {
  color: $link;
}

.has-title[title] {
  text-decoration: underline;
  text-decoration-style: dotted;
}

.weak {
  color: darken($text, 5%);
}

// TODO: Figure out how to configure select option color. https://bulma.io/documentation/form/select/
.select select option:not(:active) {
  color: darken($text, 5%) !important;
}

@media screen and (max-width: $tablet - 1) {
  #app > .body {
    padding-left: 0.75em;
    padding-right: 0.75em;
  }
}
@media screen and (min-width: $tablet) and (max-width: $desktop - 1) {
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

table,
tr,
td {
  border-collapse: collapse;
  border: 0;
}
th,
td {
  vertical-align: middle !important; // TODO
}
:not(.table) {
  th {
    text-align: left;
    padding: 0.125em 0.5em !important;
  }
  td {
    padding: 0.25em 0.5em !important;
  }
}
.table-wrap {
  display: inline-block;
  background-color: darken($background, 5%);

  @media screen and (min-width: $tablet) {
    padding: 0.25em;
  }
  @media screen and (max-width: $tablet - 1) {
    &.box {
      padding: 0.25em 0;
    }
    thead tr {
      border-bottom: 1px solid darken($background, 7.5%);
    }
    tfoot tr {
      border-top: 1px solid darken($background, 7.5%);
    }
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

.modal {
  padding: 1em;
}

.modal-content {
  padding: 1em;
  background-color: $modal-content-background-color;
}

.clickable {
  cursor: pointer;
}

.weapon-image-container {
  display: flex;
  align-content: center;
}

.proportional-bar-chart-container {
  height: 12px;
  &.egg-collection:first-child {
    margin-bottom: 2px;
  }
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
  color: $win;
}
.fail {
  color: $loss;
}

.anonymous-name {
  font-style: italic;
}

// Spacing helper
$range: 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32;

.h-space-between- {
  @each $i in $range {
    &#{$i} > *:not(:first-child) {
      margin-left: 0.125em * $i;
    }
  }
}

.v-space-between- {
  @each $i in $range {
    &#{$i} > *:not(:last-child) {
      margin-bottom: 0.125em * $i;
    }
  }
}
</style>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import GlobalHeader from '@/components/GlobalHeader.vue';
import GlobalFooter from '@/components/GlobalFooter.vue';
import { metadataModule } from '@/store/modules/metadata';
import { isDev } from '@/constants';
import { production } from '@/urls';

@Component({
  name: 'App',
  components: { ConfirmationDialog, GlobalHeader, GlobalFooter },
})
export default class App extends Vue {
  get productionLink() {
    return production + this.$route.fullPath;
  }

  get isDev() {
    return isDev;
  }

  mounted() {
    this.$root.$confirm = this.$refs.confirm.open;

    const timerId = setInterval(() => {
      const now = new Date().getTime();
      if (now > metadataModule.lastFetchedTime + SESSION_REFRESH_TIME) {
        metadataModule.refreshSession().then(() => {
          if (metadataModule.hasSessionExpired) {
            clearInterval(timerId);
          }
        });
      }
    }, 60000);
  }
}
</script>

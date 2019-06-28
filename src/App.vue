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
</style>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import GlobalHeader from './components/GlobalHeader.vue';

@Component({
  name: 'App',
  components: { GlobalHeader },
})
export default class App extends Vue {}
</script>

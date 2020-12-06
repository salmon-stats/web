<template>
  <div>
    <h2>Name</h2>
    <b-field>
      <b-input
        id="name-query"
        v-model="nameQuery"
        type="search"
        :maxlength="maxLength"
        :disabled="isSearching"
        @keypress.enter.native="search"
      />
      <p class="control">
        <b-button @click="search" :disabled="isSearching" class="button is-primary">
          Search
        </b-button>
      </p>
    </b-field>

    <template v-if="registeredUsers.length > 0" class="columns is-multiline">
      <h2>Registered Users</h2>
      <div class="columns is-multiline">
        <div v-for="player in registeredUsers" class="column is-4">
          <player-search-result :player="player" />
        </div>
      </div>
    </template>

    <template v-if="playerNames.length > 0">
      <h2>Players</h2>
      <div class="columns is-multiline">
        <div v-for="player in playerNames" class="column is-4">
          <player-search-result :player="player" />
        </div>
      </div>
    </template>

    <p v-if="hasSearchdOnce && playerNames.length === 0 && registeredUsers.length === 0">
      No players found.
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/bulma-variables.scss';

@media screen and (max-width: $tablet - 1) {
  .column {
    margin-top: 1em;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PlayerSearchResult from '@/components/PlayerSearchResult.vue';
import apiClient from '@/api-client';

const MAX_LENGTH = 15;

@Component({
  name: 'PlayerSearch',
  components: { PlayerSearchResult },
})
export default class PlayerSearch extends Vue {
  public maxLength = MAX_LENGTH;
  public isSearching = false;
  public hasSearchdOnce = false;
  public nameQuery = '';
  public playerNames = [];
  public registeredUsers = [];

  private isValidName(name: string): boolean {
    return !!name && name.length <= MAX_LENGTH;
  }

  public search() {
    if (!this.isValidName(this.nameQuery)) {
      return;
    }

    this.$router.push({
      query: {
        name: this.nameQuery,
      },
    });
    this.isSearching = true;

    apiClient
      .get('/players/search', {
        params: { name: this.nameQuery },
      })
      .then((res) => {
        this.hasSearchdOnce = true;
        this.playerNames = res.data.names;
        this.registeredUsers = res.data.users;
      })
      .finally(() => {
        this.isSearching = false;
      });
  }

  public mounted() {
    const nameQuery = this.$route.query.name as string;
    if (this.isValidName(nameQuery)) {
      this.nameQuery = nameQuery;
      this.search();
    }
  }
}
</script>

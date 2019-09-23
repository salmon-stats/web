<template>
  <require-fetch-template>
    <div v-if="salmonResult">
      <section class="overview">
        <div class="columns">
          <div class="column is-6">
            <schedule-card :schedule="parsedSchedule" :is-compact="true">
              <div class="inner-schedule-card">
                <span>Result:</span>
                <span v-if="salmonResult.fail_reason_id">
                  <span class="fail">Fail</span>
                  ({{ translate('fail_reason', salmonResult.fail_reason_id) }} in wave {{ failedWave }})
                </span>
                <span v-else class="clear">Clear</span>

                <span>Start:</span>
                <span>{{ formatDate(salmonResult.start_at) }}</span>

                <span>Hazard level:</span>
                <hazard-level :hazard-level="salmonResult.danger_rate" />
              </div>
            </schedule-card>
          </div>
        </div>
      </section>

      <section class="scores">
        <h2>Scores</h2>

        <!-- For phones -->
        <div class="is-hidden-tablet">
          <player-score-mobile v-for="player in salmonResult.player_results" :key="player.player_id"
            :player="player"
            :get-account-by-player-id="getAccountByPlayerId"
            :get-player-name="getPlayerName"
            :has-most="hasMost"
          />
        </div>

        <!-- For tablets, desktop computers -->
        <div class="is-hidden-mobile table-wrap">
          <table class="is-hoverable">
            <thead>
              <tr>
                <th class="player-icon"></th>
                <th class="player-name">Player</th>
                <th class="special-usage">Special</th>
                <th class="main-weapons">Main</th>
                <th>Rescue</th>
                <th>Death</th>
                <th>Boss</th>
                <th>Egg</th>
              </tr>
            </thead>
            <tbody>
              <!-- Todo: highlight if my row -->
              <tr :class="['player-summary', 'clickable', isMyPlayerId(p.player_id) ? 'my' : null]"
                v-for="p in salmonResult.player_results" :key="p.player_id"
                @click="toPlayerSummary(p.player_id)">
                <td class="player-icon">
                  <player-avatar :user="getAccountByPlayerId(p.player_id)"
                    :size="32" :blockiesSeed="p.player_id" />
                </td>
                <td class="player-name">
                  {{ getPlayerName(p.player_id) }}
                </td>
                <td class="special-usage">
                  <special-usage :special-id="p.special_id"
                    :count="sum(p.special_uses.map(special => special.count))" />
                </td>
                <td class="main-weapons">
                  <span class="weapon-icon main" v-for="(w, i) in p.weapons" :key="i">
                    <main-weapon :weapon-id="w.weapon_id" />
                  </span>
                </td>
                <td>
                  <p><span :class="hasMost('rescue', p.rescue) ? 'has-most' : ''">{{ p.rescue }}</span></p>
                  <p class="proportional-bar-chart-container">
                    <proportional-bar-chart chart-key="rescue"
                      :value="p.rescue" :max="salmonResult.highest.rescue" />
                  </p>
                </td>
                <td>
                  <p><span :class="hasLeastDeath(p.death) ? 'has-least-death' : ''">{{ p.death }}</span></p>
                  <p class="proportional-bar-chart-container">
                    <proportional-bar-chart chart-key="death"
                      :value="p.death" :max="salmonResult.highest.death" />
                  </p>
                </td>
                <td>
                  <p><span :class="hasMost('boss_elimination_count', p.boss_elimination_count) ? 'has-most' : ''">{{ p.boss_elimination_count }}</span></p>
                  <p class="proportional-bar-chart-container">
                    <proportional-bar-chart chart-key="boss-kill"
                      :value="p.boss_elimination_count" :max="salmonResult.highest.boss_elimination_count" />
                  </p>
                </td>
                <td>
                  <p>
                    <span class="golden-egg" :class="hasMost('golden_eggs', p.golden_eggs) ? 'has-most' : ''">{{ p.golden_eggs }}</span>
                    +
                    <span class="power-egg" :class="hasMost('power_eggs', p.power_eggs) ? 'has-most' : ''">{{ p.power_eggs }}</span>
                  </p>
                  <p class="proportional-bar-chart egg-collection">
                    <proportional-bar-chart chart-key="golden-egg"
                      :value="p.golden_eggs" :max="salmonResult.highest.golden_eggs" />
                    <proportional-bar-chart chart-key="power-egg"
                      :value="p.power_eggs" :max="salmonResult.highest.power_eggs" />
                  </p>
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <!-- sum of rescue always equals to sum of death -->
                <td><!-- {{ salmonResult.total_result.rescue }} --></td>
                <td>{{ salmonResult.total_result.death }}</td>
                <td>
                  {{ salmonResult.boss_elimination_count }}<span class="total-count">/{{ salmonResult.boss_appearance_count }}</span>
                </td>
                <td>
                  <span class="golden-egg">{{ salmonResult.total_result.golden_eggs }}</span>
                  <span class="total-count">/{{ totalGoldenEggsAppeared }}</span>
                  +
                  <span class="power-egg">{{ salmonResult.total_result.power_eggs }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div class="columns is-desktop reverse-row-order">
        <section class="waves column is-4-desktop">
          <h2>Waves</h2>
          <div>
            <wave v-for="wave in salmonResult.waves" :key="wave.wave"
              class="wave"
              :failed-wave="failedWave"
              :translate="translate"
              :result="salmonResult"
              :wave="wave" />
          </div>
        </section>

        <section class="bosses column is-8-desktop">
          <h2>Boss Eliminations</h2>
          <div class="box table-wrap boss-eliminations">
            <table class="is-hoverable">
              <thead>
                <tr>
                  <th class="boss-name"></th>
                  <th v-for="pid in salmonResult.members" :key="pid">
                    <div class="clickable" @click="toPlayerSummary(pid)">
                      <player-avatar :user="getAccountByPlayerId(pid)"
                        :size="32" :blockiesSeed="pid" />
                    </div>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr :class="hasEliminatedEverySpawn(bossId) ? 'has-eliminated-every-spawn' : null" v-for="bossId in appearedBossIds" :key="bossId">
                  <th class="boss-name">
                    <img :src="iconUrl('salmon-boss', bossId)">
                    <span class="is-hidden-touch">{{ translate('boss', bossId) }}</span>
                  </th>
                  <td class="player-boss-elimination" v-for="(p, playerIndex) in salmonResult.player_results" :key="p.pid">
                    <span :class="hasMost('boss_eliminations', p.boss_eliminations.counts[bossId], bossId) ? 'has-most' : null">{{ p.boss_eliminations.counts[bossId] }}</span>
                    <proportional-bar-chart :chart-key="`player-${playerIndex + 1}`"
                      :value="p.boss_eliminations.counts[bossId]"
                      :max="salmonResult.highest.boss_eliminations[bossId]" />
                  </td>
                  <td class="total-boss-elimination">
                    {{ totalBossElimination(bossId) }}/{{ totalBossSpawn(bossId) }}
                    <proportional-bar-chart chart-key="boss-kill"
                      :fill-remainder="true"
                      :value="totalBossElimination(bossId)"
                      :max="totalBossSpawn(bossId)" />
                  </td>
                </tr>
                <tr :class="['total', appearedBossIds.every(hasEliminatedEverySpawn) ? 'has-eliminated-every-spawn' : null]">
                  <th class="boss-name total">
                    <span>Total</span>
                  </th>
                  <td class="player-boss-elimination" v-for="(p, playerIndex) in salmonResult.player_results" :key="p.pid">
                    <span :class="hasMost('boss_elimination_count', p.boss_elimination_count) ? 'has-most' : null">
                      {{ p.boss_elimination_count }}
                    </span>
                    <proportional-bar-chart :chart-key="`player-${playerIndex + 1}`"
                      :value="p.boss_elimination_count"
                      :max="salmonResult.highest.boss_elimination_count" />
                  </td>
                  <td class="total-boss-elimination">
                    {{ salmonResult.boss_elimination_count }}/{{ salmonResult.boss_appearance_count }}
                    <proportional-bar-chart chart-key="boss-kill"
                      :fill-remainder="true"
                      :value="salmonResult.boss_elimination_count"
                      :max="salmonResult.boss_appearance_count" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </require-fetch-template>
</template>

<script src="./SalmonResult.ts" lang="ts"></script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
@import '@/assets/bulma-variables.scss';
@import '@/assets/helper-functions.scss';

.scores, .waves, .bosses {
  margin-top: 1.5em;
}

th.player-icon, td.player-icon {
  width: 32px;
}
td.player-name {
  width: 11em;
}
td.special-usage {
  width: 4em;
}
td.main-weapons {
  width: 112px; // magic number
}
@media (max-width: $desktop - 1) {
  th.boss-name {
    width: 32px;
  }
}
@media (min-width: $desktop) {
  th.boss-name.total span {
    margin-left: 32px;
  }
}

.inner-schedule-card {
  display: grid;
  grid-template-columns: auto 1fr;
  span:nth-child(odd) { text-align: right; }
  span:nth-child(even) { margin-left: .5em; }
}

.total-count {
  font-size: 80%;
  &:not(.golden-egg) {
    color: darken($body-color, 20%);
  }
}

.table-wrap, table {
  width: 100%;
}

img {
  width: 32px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
.has-most, .has-least-death {
  text-decoration: underline;
}
.has-eliminated-every-spawn {
  th {
    color: $golden-egg;
  }
  .total-boss-elimination {
    color: $golden-egg;
    font-weight: bold;
  }
}

.proportional-bar-chart-container {
  height: 12px;
  &.egg-collection:first-child {
    margin-bottom: 2px;
  }
}

.boss-eliminations {
  th {
    font-weight: normal;
  }
}
</style>

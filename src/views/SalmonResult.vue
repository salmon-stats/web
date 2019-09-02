<template>
  <require-fetch-template>
    <div v-if="salmonResult">
      <h2>Overview</h2>
      <p>Hazard level: {{ salmonResult.danger_rate }}%</p>
      <p>Schedule: {{ salmonResult.schedule_id }}</p>
      <p>Start: {{ salmonResult.start_at }}</p>
      <p>Result:
        <span v-if="salmonResult.fail_reason_id">
          Fail (wave {{ failedWave }})
          ({{ translate('fail_reason', salmonResult.fail_reason_id) }})
        </span>
        <span v-else>Clear</span>
      </p>
      <p>Weapons:
        <span v-for="weaponId in salmonResult.schedule.weapons">
          <main-weapon :weapon-id="weaponId" />
        </span>
        <span v-if="salmonResult.schedule.weapons.some(id => id === -1) && salmonResult.schedule.rare_weapon_id !== null">
          Rare:
          <main-weapon :weapon-id="salmonResult.schedule.rare_weapon_id" />
        </span>
      </p>
      <p>Stage: {{ translate('stage', salmonResult.schedule.stage_id) }}</p>

      <h2>Scores</h2>
      <div class="table-wrap">
        <table class="is-hoverable">
          <thead>
            <th></th>
            <th>Player</th>
            <th>Special</th>
            <th>Main</th>
            <th>Rescue</th>
            <th>Death</th>
            <th>Boss</th>
            <th>Egg</th>
          </thead>
          <tbody>
            <!-- Todo: highlight if my row -->
            <tr class="player-summary clickable"
              v-for="p in salmonResult.player_results" :key="p.player_id"
              @click="toPlayerSummary(p.player_id)">
              <td>
                <player-avatar :user="getAccountByPlayerId(p.player_id)"
                  :size="32" :blockiesSeed="p.player_id" />
              </td>
              <td>
                {{ getPlayerName(p.player_id) }}
              </td>
              <td>
                <special-usage :special-id="p.special_id"
                  :count="sum(p.special_uses.map(special => special.count))" />
              </td>
              <td>
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
                {{ salmonResult.boss_elimination_count }}/{{ salmonResult.boss_appearance_count }}
              </td>
              <td>
                <span class="golden-egg">{{ salmonResult.total_result.golden_eggs }}</span>
                +
                <span class="power-egg">{{ salmonResult.total_result.power_eggs }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Waves</h2>
      <div class="table-wrap waves">
        <table class="is-hoverable">
          <thead>
            <tr>
              <th>Wave</th>
              <th>Water level</th>
              <th>Event</th>
              <th colspan="4">Specials used</th>
              <th colspan="2">Egg</th>
            </tr>
          </thead>
          <tbody>
            <tr :class="{ 'failed-wave': failedWave === wave.wave }"
              v-for="wave in salmonResult.waves" :key="wave.wave">
              <th>
                {{ wave.wave }}
                <span class="failed-wave-overlay" v-if="failedWave === wave.wave"></span>
              </th>
              <td class="tide">{{ translate('water_level', wave.water.id) }}</td>
              <td class="event">{{ wave.event ? translate('event', wave.event.id) : '-' }}</td>
              <td class="special-usage" v-for="special in specialsUsedInWave(wave.wave)">
                <special-usage v-if="special.count" :special-id="special.id" :count="special.count" />
              </td>
              <td class="golden-egg">{{ wave.golden_egg_delivered }}/{{ wave.golden_egg_quota }}</td>
              <td class="power-egg">{{ wave.power_egg_collected }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Boss Eliminations</h2>
      <div class="table-wrap boss-eliminations">
        <table class="is-hoverable">
          <thead>
            <th class="boss-name"></th>
            <th v-for="pid in salmonResult.members" :key="pid">
              <div class="clickable" @click="toPlayerSummary(pid)">
                <player-avatar :user="getAccountByPlayerId(pid)"
                  :size="32" :blockiesSeed="pid" />
              </div>
            </th>
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
    </div>
  </require-fetch-template>
</template>

<script src="./SalmonResult.ts" lang="ts"></script>

<style lang="scss" scoped>
@import '../assets/variables.scss';
@import '../assets/helper-functions.scss';

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
.golden-egg {
  color: $golden-egg;
}
.power-egg {
  color: $power-egg;
}

.proportional-bar-chart-container {
  height: 12px;
  &.egg-collection:first-child {
    margin-bottom: 2px;
  }
}

.waves {
  tr {
    /* TODO: don't use magic number */
    height: 44px;
  }

  th:first-of-type {
    text-align: center;
    width: 1.5em;
    position: relative;
    .failed-wave-overlay {
      position: absolute;
      z-index: 1;
      left: .25em; /* == padding / 2 */
      right: .25em;
      top: 22px; /* 44 / 2 */
      transform: rotate(-45deg);
      border-top: 2px solid #ff4c4c;
    }
  }

  .tide {
    min-width: 5em;
  }
  .event {
    min-width: 10em;
  }
  .special-usage {
    /* TODO: don't use magic number */
    width: 44px;
  }
}

.boss-eliminations {
  th {
    font-weight: normal;
  }
}
</style>

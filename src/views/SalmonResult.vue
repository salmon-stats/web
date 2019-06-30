<template>
  <div>
    <div v-if="salmonResult">
      <p>Hazard level: {{ salmonResult.danger_rate }}%</p>

      <h2>Summary</h2>
      <div class="table-wrap">
        <table class="is-hoverable">
          <thead>
            <th></th>
            <th>Player</th>
            <th>Weapon</th>
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
                <span class="weapon-icons">
                  <span class="weapon-icon special">
                    <img :src="img('special', p.special_id)">
                  </span>
                  <span class="weapon-icon main" v-for="(w, i) in p.weapons" :key="i">
                    <img :src="img('weapon', w.weapon_id)">
                  </span>
                </span>
              </td>
              <td>
                <p><span :class="hasMost('rescue', p.rescue) ? 'has-most' : ''">{{ p.rescue }}</span></p>
                <p class="proportional-bar-chart-container">
                  <proportional-bar-chart chart-key="rescue" :value="p.rescue" :highest="salmonResult.highest.rescue" />
                </p>
              </td>
              <td>
                <p><span :class="hasMost('death', p.death) ? 'has-most' : ''">{{ p.death }}</span></p>
                <p class="proportional-bar-chart-container">
                  <proportional-bar-chart chart-key="death" :value="p.death" :highest="salmonResult.highest.death" />
                </p>
              </td>
              <td>
                <p><span :class="hasMost('total_boss_eliminations', p.total_boss_eliminations) ? 'has-most' : ''">{{ p.total_boss_eliminations }}</span></p>
                <p class="proportional-bar-chart-container">
                  <proportional-bar-chart chart-key="boss-kill" :value="p.total_boss_eliminations" :highest="salmonResult.highest.total_boss_eliminations" />
                </p>
              </td>
              <td>
                <p>
                  <span class="golden-egg" :class="hasMost('golden_eggs', p.golden_eggs) ? 'has-most' : ''">{{ p.golden_eggs }}</span>
                  +
                  <span class="power-egg" :class="hasMost('power_eggs', p.power_eggs) ? 'has-most' : ''">{{ p.power_eggs }}</span>
                </p>
                <p class="proportional-bar-chart egg-collection">
                  <proportional-bar-chart chart-key="golden-egg" :value="p.golden_eggs" :highest="salmonResult.highest.golden_eggs" />
                  <proportional-bar-chart chart-key="power-egg" :value="p.power_eggs" :highest="salmonResult.highest.power_eggs" />
                </p>
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <!-- sum of rescue always equals to sum of death -->
              <td><!-- {{ salmonResult.total_result.rescue }} --></td>
              <td>{{ salmonResult.total_result.death }}</td>
              <td>{{ salmonResult.total_result.total_boss_eliminations }}</td>
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
      <div class="table-wrap">
        <table class="is-hoverable">
          <tbody>
            <tr v-for="wave in salmonResult.waves" :key="wave.wave">
              <th>{{ wave.wave }}</th>
              <td>{{ wave.water.name }}</td>
              <td>{{ wave.event ? wave.event.name : '' }}</td>
              <td v-for="special in specialsUsedInWave(wave.wave)">
                <span v-if="special.count">
                  <img :src="img('special', special.id)">
                  {{ special.count }}
                </span>
              </td>
              <td class="golden-egg">{{ wave.golden_egg_delivered }}/{{ wave.golden_egg_quota }}</td>
              <td class="power-egg">{{ wave.power_egg_collected }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Boss Eliminations</h2>
      <div class="table-wrap">
        <table class="is-hoverable">
          <thead>
            <th></th>
            <th v-for="pid in salmonResult.members" :key="pid">
              <div class="clickable" @click="toPlayerSummary(pid)">
                <player-avatar :user="getAccountByPlayerId(pid)"
                  :size="32" :blockiesSeed="pid" />
              </div>
            </th>
          </thead>
          <tbody>
            <tr v-for="bossId in appearedBossIds" :key="bossId">
              <td>{{ bossId }}</td>
              <td class="player-boss-elimination" v-for="(p, playerIndex) in salmonResult.player_results" :key="p.pid">
                <span :class="hasMost('boss_eliminations', p.boss_eliminations.counts[bossId], bossId) ? 'has-most' : null">{{ p.boss_eliminations.counts[bossId] }}</span>
                <proportional-bar-chart :chart-key="`player-${playerIndex + 1}`"
                  :value="p.boss_eliminations.counts[bossId]"
                  :highest="salmonResult.highest.boss_eliminations[bossId]" />
              </td>
              <td class="total-boss-elimination">
                {{ totalBossElimination(bossId) }}/{{ totalBossSpawn(bossId) }}
                <span class="total-boss-elimination-rate-chart">
                  <proportional-bar-chart chart-key="boss-kill"
                    :value="totalBossElimination(bossId)"
                    :highest="totalBossSpawn(bossId)" />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script src="./SalmonResult.ts" lang="ts"></script>

<style scoped lang="scss">
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
a {
  color: #42b983;
}
.has-most {
  text-decoration: underline;
}
.golden-egg {
  color: #f1c40f;
}
.power-egg {
  color: #e67e22;
}

.weapon-icons {
  height: 32px;
  display: flex;
  .weapon-icon {
    align-items: center;
    &.special {
      margin-right: 16px;
    }
  }
}
.proportional-bar-chart-container {
  height: 12px;
  &.egg-collection:first-child {
    margin-bottom: 2px;
  }
}
.total-boss-elimination-rate-chart {
  display: block;
  background-color: white;
}
</style>

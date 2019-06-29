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
                <img :src="getPlayerAvatar(p.player_id)" v-if="isRegistered(p.player_id)">
                <blockies :sizePerPixel="4" :pixels="8" :seed="p.player_id" v-else></blockies>
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
</style>

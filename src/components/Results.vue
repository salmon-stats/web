<template>
  <div>
    <div v-if="this.isPlayerResults" class="field">
      <b-switch v-model="isTeamView">Team</b-switch>
    </div>

    <div class="table-wrap is-fullwidth">
      <table class="is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th></th>
            <th>Date</th>
            <th>Eggs</th>
            <th>Boss</th>
            <th class="is-hidden-mobile">Members</th>
          </tr>
        </thead>
        <tbody>
          <tr class="clickable" @click="toResultPage(result.id)"
            v-for="result in results" :key="result.id">
            <td>
              <p v-if="result.fail_reason_id">
                <span class="fail">Fail</span>
                <span class="is-hidden-mobile"> ({{result.clear_waves}}/3)</span>
              </p>
              <p v-else class="clear">Clear</p>

              <p>
                <small class="weak">
                  <hazard-level v-if="isTeamView" :hazard-level="result.danger_rate" />
                  <span v-else-if="result.grade_point < 400">-</span>
                  <span v-else>{{ profreshionalGradePoint(result.grade_point) }}</span>
                </small>
              </p>
            </td>

            <td>
              <p>{{ dateFormatter(result.start_at) }}</p>
            </td>

            <td class="eggs">
              <div v-if="isTeamView">
                <img src="@/assets/golden-egg.png"><span class="golden-egg">{{ result.golden_egg_delivered }}</span>
                <img src="@/assets/power-egg.png"><span class="power-egg">{{ result.power_egg_collected }}</span>
              </div>
              <div v-else>
                <img src="@/assets/golden-egg.png"><span class="golden-egg">{{ result.golden_eggs }}</span>
                <img src="@/assets/power-egg.png"><span class="power-egg">{{ result.power_eggs }}</span>
              </div>
            </td>

            <td>
              <p>
                {{ result[bossEliminationKey] }}/{{ result[bossEliminationDividerKey] }}
              </p>

              <p class="proportional-bar-chart-container">
                <proportional-bar-chart chart-key="boss-kill"
                  :fill-remainder="true"
                  :value="result[bossEliminationKey]" :max="result[bossEliminationDividerKey]" />
              </p>
            </td>

            <td class="members is-hidden-mobile">
              <template v-if="membersData(result.members).length > 0">
                <router-link v-for="member in membersData(result.members)" :key="member.playerId"
                  @click.stop.native
                  :to="`/players/${member.playerId}`
                ">
                  <player-avatar class="avatar" :size="member.isRegistered ? 32 : 24" :user="member" />
                </router-link>
              </template>
            </td>
         </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showMoreLink">
      <router-link :to="showMoreLink">Show more</router-link>
    </div>

    <div v-if="resultsWithPagination">
      <b-pagination
        :total="resultsWithPagination.total"
        :current.sync="currentPage"
        :per-page="resultsWithPagination.per_page"
        :range-before="3"
        :range-after="3"
        icon-pack="material-icons"
        @change="paginate"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.eggs div {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;

  img {
    justify-self: center;
    width: auto;
    height: 16px;
  }
}

.avatar {
  margin-left: .25em;
}
</style>

<script src="./Results.ts"></script>

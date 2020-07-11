<template>
  <div>
    <div class="table-wrap is-fullwidth">
      <filter-controller v-if="paginator" @clear="filters = createResultFilter()" @search="search">
        <results-filter :value.sync="filters" :available-filters="availableFilters" />
      </filter-controller>

      <div v-if="isPlayerResults" class="field">
        <b-switch v-model="isTeamView">
          Team
        </b-switch>
      </div>

      <table class="is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th />
            <th class="is-hidden-mobile">
              Date
            </th>
            <th>Eggs</th>
            <th v-if="isPlayerResults">
              Weapons
            </th>
            <th class="is-hidden-mobile">
              Boss
            </th>
            <th>Members</th>
            <!-- TODO: show members -->
          </tr>
        </thead>
        <tbody>
          <template v-for="result in results">
            <tr
              v-if="showScheduleGroupRow && shouldShowScheduleHeading(result.schedule_id)"
              :key="result.schedule_id"
              class="schedule clickable"
              @click="$router.push(scheduleRouter(result.schedule_id))"
            >
              <td colspan="100">
                <strong><schedule :schedule-id="result.schedule_id" /></strong>
              </td>
            </tr>

            <tr class="clickable" @click="toResultPage(result.id)" :key="result.id">
              <td>
                <p v-if="result.fail_reason_id">
                  <span class="fail">Fail</span>
                  <span class="is-hidden-mobile"> ({{ result.clear_waves }}/3)</span>
                </p>
                <p v-else class="clear">
                  Clear
                </p>

                <p>
                  <small class="weak">
                    <hazard-level v-if="isTeamView" :hazard-level="result.danger_rate" />
                    <!-- todo: support grades other than profreshional -->
                    <span v-else-if="result.grade_point < 400">-</span>
                    <span v-else>{{ profreshionalGradePoint(result.grade_point) }}</span>
                  </small>
                </p>
              </td>

              <td class="is-hidden-mobile">
                <p class="is-hidden-tablet start-date">
                  {{ dateFormatterShort(result.start_at) }}
                </p>
                <p class="is-hidden-mobile start-date">
                  {{ dateFormatter(result.start_at) }}
                </p>
              </td>

              <td class="eggs">
                <div v-if="isTeamView">
                  <img src="@/assets/golden-egg.png" /><span class="golden-egg">{{ result.golden_egg_delivered }}</span>
                  <img src="@/assets/power-egg.png" /><span class="power-egg">{{ result.power_egg_collected }}</span>
                </div>
                <div v-else>
                  <img src="@/assets/golden-egg.png" /><span class="golden-egg">{{ result.golden_eggs }}</span>
                  <img src="@/assets/power-egg.png" /><span class="power-egg">{{ result.power_eggs }}</span>
                </div>
              </td>

              <td v-if="isPlayerResults">
                <div class="weapons is-hidden-tablet">
                  <template v-if="isTeamView">
                    <special-usage class="special-weapon" :special-id="result.special_id" :size="32" />
                  </template>
                  <template v-else>
                    <main-weapon
                      v-for="(weapon, i) in result.weapons"
                      :key="i"
                      class="main-weapon"
                      :weapon-id="weapon.weapon_id"
                      :size="21"
                    />
                  </template>
                </div>
                <div class="weapons is-hidden-mobile">
                  <special-usage class="special-weapon" :special-id="result.special_id" :size="32" />
                  <main-weapon
                    v-for="(weapon, i) in result.weapons"
                    :key="i"
                    class="main-weapon"
                    :weapon-id="weapon.weapon_id"
                    :size="24"
                  />
                </div>
              </td>

              <td class="is-hidden-mobile">
                <p>{{ result[bossEliminationKey] }}/{{ result[bossEliminationDividerKey] }}</p>

                <p class="proportional-bar-chart-container">
                  <proportional-bar-chart
                    chart-key="boss-kill"
                    :fill-remainder="true"
                    :value="result[bossEliminationKey]"
                    :max="result[bossEliminationDividerKey]"
                  />
                </p>
              </td>

              <td class="members">
                <template v-if="membersData(result.members).length > 0">
                  <router-link
                    v-for="member in membersData(result.members)"
                    :key="member.playerId"
                    @click.stop.native
                    :to="`/players/${member.playerId}`"
                  >
                    <span class="is-hidden-mobile">
                      <player-avatar class="avatar" :size="member.isRegistered ? 32 : 24" :user="member" />
                    </span>
                    <span class="is-hidden-tablet">
                      <player-avatar class="avatar" :size="member.isRegistered ? 24 : 18" :user="member" />
                    </span>
                  </router-link>
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="showMoreLink">
      <router-link :to="showMoreLink">
        Show more
      </router-link>
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
@import '@/assets/bulma-variables.scss';

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
  margin-left: 0.25em;
}

.start-date {
  white-space: nowrap;
}

.weapons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  &.is-hidden-tablet {
    .special-weapon {
      flex: 0 1 100%;
    }
  }

  .main-weapon {
    margin-left: 0.25em;
  }
}

.schedule {
  height: $body-size * $body-line-height * 1.5;
}
</style>

<script src="./Results.ts"></script>

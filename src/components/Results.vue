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
            <th class="is-hidden-mobile">Schedule</th>
            <th>Date</th>
            <th v-if="isHazardColumnVisible">Hazard</th>
            <th v-if="isGradeColumnVisible"><span class="has-title" title="Profreshional">Grade</span></th>
            <th>Eggs</th>
            <th>Boss</th>
          </tr>
        </thead>
        <tbody>
          <tr class="clickable" @click="toResultPage(result.id)"
            v-for="result in results" :key="result.id">
            <td v-if="result.fail_reason_id">
              <span class="fail">Fail</span>
              <span class="is-hidden-mobile"> ({{result.clear_waves}}/3)</span>
            </td>
            <td v-else>
              <span class="clear">Clear</span>
            </td>

            <td class="is-hidden-mobile">
              <schedule :date-formatter="dateFormatter" :is-link-disabled="true" :schedule-id="result.schedule_id" />
            </td>

            <td>{{ dateFormatter(result.start_at) }}</td>

            <td v-if="isHazardColumnVisible">
              <hazard-level :hazard-level="result.danger_rate" />
            </td>

            <td v-if="isGradeColumnVisible">
              {{ profreshionalGradePoint(result.grade_point) }}
            </td>

            <td>
              <p v-if="isTeamView">
                <span class="golden-egg">{{ result.golden_egg_delivered }}</span>+<span class="power-egg">{{ result.power_egg_collected }}</span>
              </p>
              <p v-else>
                <span class="golden-egg">{{ result.golden_eggs }}</span>+<span class="power-egg">{{ result.power_eggs }}</span>
              </p>
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

<script src="./Results.ts"></script>

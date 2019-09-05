<template>
  <div>
    <div class="table-wrap">
      <table class="is-hoverable">
        <thead>
          <tr>
            <th></th>
            <th>Schedule</th>
            <th>Date</th>
            <th>Hazard</th>
            <th>Golden Eggs</th>
            <th>Power Eggs</th>
            <th>Boss Eliminations</th>
          </tr>
        </thead>
        <tbody>
          <tr class="clickable" @click="toResultPage(result.id)"
            v-for="result in results" :key="result.id">
            <td v-if="result.fail_reason_id">
              <span class="fail">Fail</span> ({{result.clear_waves}}/3)
            </td>
            <td v-else>
              <span class="clear">Clear</span>
            </td>

            <td>
              <schedule :date-formatter="dateFormatter" :is-link-disabled="true" :schedule-id="result.schedule_id" />
            </td>

            <td>{{ dateFormatter(result.start_at) }}</td>

            <td>
              <hazard-level :hazard-level="result.danger_rate" />
            </td>

            <td>
              <span class="golden-egg">{{ result.golden_egg_delivered }}</span>
            </td>

            <td>
              <span class="power-egg">{{ result.power_egg_collected }}</span>
            </td>

            <td>
              <p>{{ result.boss_elimination_count }}/{{ result.boss_appearance_count }}</p>
              <p class="proportional-bar-chart-container">
                <proportional-bar-chart chart-key="boss-kill"
                  :fill-remainder="true"
                  :value="result.boss_elimination_count" :max="result.boss_appearance_count" />
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

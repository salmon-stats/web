<template>
  <div>
    <div class="table-wrap">
      <table class="is-hoverable">
        <tbody>
          <tr class="clickable" @click="toResultPage(result.id)"
            v-for="result in results" :key="result.id">
            <td :class="result.fail_reason_id ? 'fail' : 'clear'">
              {{ result.fail_reason_id ? 'Fail' : 'Clear' }}
            </td>
            <td>{{ result.start_at }}</td>
            <td>{{ result.danger_rate }}</td>
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
        @change="paginationCallback"
      />
    </div>
  </div>
</template>

<script src="./Results.ts"></script>

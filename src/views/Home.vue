<template>
  <div class="home">
    <div>
      <p>To upload results to this website, please use <a href="https://github.com/tkgstrator/Salmonia/releases">command-line result uploader (Salmonia)</a>.</p>
    </div>

    <p>
      With contributions from <a href="https://twitter.com/tkgling">@tkgling</a> and <a href="https://twitter.com/barley_ural">@barley_ural</a>,
      developed &amp; run by <a href="https://twitter.com">@Yukinkling</a>.
    </p>

    <!-- TODO: Use tab for phones -->
    <div v-if="isSchedulesAvailable" class="columns">
      <div class="column">
        <h2>Past Schedules</h2>
        <ul>
          <li v-for="schedule in pastSchedules" :key="schedule.scheduleId">
            <schedule-card :schedule="schedule" />
          </li>
          <!-- TODO: Add "Show more" button (link to /schedules) -->
        </ul>
      </div>

      <div class="column">
        <h2>Ongoing Schedule</h2>
        <p v-if="!ongoingSchedule">There's no ongoing Salmon Run schedule.</p>
        <schedule-card v-else difference-to="endAt"
          :now="now" :schedule="ongoingSchedule" />
      </div>

      <div class="column">
        <h2>Future Schedules</h2>
        <ul>
          <li v-for="schedule in futureSchedules" :key="schedule.scheduleId">
            <schedule-card difference-to="startAt"
              :now="now" :schedule="schedule" />
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      Loading schedule...
    </div>
  </div>
</template>

<script src="./Home.ts"></script>

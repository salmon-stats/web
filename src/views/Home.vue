<template>
  <div class="home">
    <div class="about">
      <p class="badges">
        <a href="https://discord.gg/HqmPjZn">
          <img src="https://discordapp.com/api/guilds/607929827760275456/widget.png?style=shield" style="height: 20px;">
        </a>
        <a href="https://github.com/yukidaruma/salmon-stats-api">
          <img src="https://img.shields.io/github/license/yukidaruma/salmon-stats-api">
        </a>
        <a href="https://github.com/yukidaruma/salmon-stats-api">
          <img src="https://img.shields.io/github/stars/yukidaruma/salmon-stats-api?style=social">
        </a>
      </p>
      <p><strong>Salmon Stats</strong> is an <a href="https://github.com/yukidaruma/salmon-stats-api">open-source</a> Splatoon 2 Salmon Run statistics website.</p>
      <p>To upload results to this website, please use <a href="https://github.com/tkgstrator/Salmonia/releases">command-line result uploader (Salmonia)</a>.</p>
      <p>
        With contributions from <a href="https://twitter.com/tkgling">@tkgling</a> and <a href="https://twitter.com/barley_ural">@barley_ural</a>,
        developed &amp; run by <a href="https://twitter.com">@Yukinkling</a>.
      </p>
    </div>

    <!-- TODO: Use tab for phones -->
    <div v-if="isSchedulesAvailable" class="columns">
      <div class="column">
        <h2 class="has-margin-top">Last Schedule</h2>
        <schedule-card v-if="pastSchedules.length > 0"
          :schedule="pastSchedules[pastSchedules.length - 1]" />
      </div>

      <div class="column">
        <h2 class="has-margin-top">Ongoing Schedule</h2>
        <p v-if="!ongoingSchedule">There's no ongoing Salmon Run schedule.</p>
        <schedule-card v-else
          difference-to="endAt"
          :now="now"
          :schedule="ongoingSchedule" />
      </div>

      <div class="column">
        <h2 class="has-margin-top">Next Schedule</h2>
        <ul>
          <schedule-card v-if="upcomingSchedules.length > 0"
            difference-to="startAt"
            :now="now"
            :schedule="upcomingSchedules[0]" />
        </ul>
      </div>
    </div>
    <div v-else class="is-marginless columns">
      Loading schedule...
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/bulma-variables.scss';

.about {
  margin-bottom: $column-gap;
  .badges a:not(:first-child) {
    margin-left: .5em;
  }
}

.external-links {
  justify-content: center;
  align-content: center;
}

li:not(:last-child) {
  margin-bottom: 1em;
}
</style>

<script src="./Home.ts"></script>

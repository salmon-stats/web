<template>
  <div :class="['box', isClickable && 'clickable']"
      @click="$router.push(scheduleSummaryRoute)">
    <p>
      <strong>
        <router-link :to="scheduleSummaryRoute">
          {{ startAt }} ~ {{ endAt }}
        </router-link>
      </strong>

      <small v-if="timeDifference">({{ timeDifference }})</small>
    </p>

    <p><small>{{ $t(`stage.${stageKey(schedule.stageId)}`) }}</small></p>

    <div class="weapons">
      <main-weapon v-for="weapon in schedule.weapons" :key="weapon"
        :weapon-id="weapon" :size="32" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/bulma-variables.scss';

.box {
  padding: .5em .75em;
}

a {
  color: $box-accent-color !important;
}

img {
  width: 32px;
}

.weapons {
  margin: .5em 0 0 .5em;
}
.weapons img:not(:first-child) {
  margin-left: .25em;
}
</style>

<script src="./ScheduleCard.ts"></script>

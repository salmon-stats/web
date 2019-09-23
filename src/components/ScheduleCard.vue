<template>
  <div :class="['box', isClickable && 'clickable', isCompact && 'is-compact']"
      @click="$router.push(scheduleSummaryRoute)">
    <div>
      <p class="schedule-date">
        <strong>
          <router-link :to="scheduleSummaryRoute">
            {{ startAt }} ~ {{ endAt }}
          </router-link>
        </strong>

        <small v-if="timeDifference">({{ timeDifference }})</small>
      </p>

      <p class="stage-name"><small>{{ $t(`stage.${stageKey(schedule.stageId)}`) }}</small></p>

      <div class="weapons">
        <main-weapon v-for="(weapon, i) in schedule.weapons" :key="i"
          :weapon-id="weapon" :size="32" />
      </div>
    </div>

    <slot />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/bulma-variables.scss';

.stage-name {
  overflow: hidden;
  small {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.is-compact > div:first-child {
  display: flex;

  .schedule-date { display: none; }
  .stage-name, .weapons {
    display: inline-flex;
    align-self: center;
  }
  .stage-name {
    font-size: 115%;
    color: $text-strong;
  }
  .weapons {
    min-width: calc(32px * 4 + #{.5em} * 3);
    flex: 1;
    justify-content: flex-end;
    margin-top: 0;
  }
}

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

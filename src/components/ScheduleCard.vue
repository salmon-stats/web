<template>
  <div>
    <router-link :to="`/schedules/${schedule.scheduleId}/records`">
      {{ startAt }} ~ {{ endAt }}
    </router-link>

    {{ timeDifference }}

    <div>
      <main-weapon v-for="weapon in schedule.weapons" :key="weapon"
        :weapon-id="weapon" :highlight-on-hover="false" :size="32" />
    </div>
  </div>
</template>

<style scoped>
img {
  width: 32px;
}
</style>

<script src="./ScheduleCard.ts"></script>

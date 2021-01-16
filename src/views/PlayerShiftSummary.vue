<template>
  <require-fetch-template>
    <schedule-card v-if="schedule" :schedule="schedule" />

    <template v-if="shiftSummary">
      <div class="columns reverse-row-order">
        <div class="column is-9">
          <shift-details
            :is-detail="true"
            :normalize-failed-game="normalizeFailedGame"
            :player-name="player && player.name"
            :shift-summaries="[
              {
                isGlobal: false,
                ...summary,
                rescue: summary.player_rescue,
                death: summary.player_death,
              },
              {
                isGlobal: true,
                ...shiftSummary.global,
                rescue: shiftSummary.global.rescue,
              },
            ]"
          />
        </div>

        <section class="column is-3 v-space-between-4">
          <div>
            <h2>
              Main weapons
              <small v-if="schedule.weapons.includes(-1)" class="pseudo-link" @click="isWeaponsModalOpen = true">
                ({{ shiftSummary.weapons.length }} / {{ availableWeapons }})
              </small>
            </h2>

            <b-modal :active.sync="isWeaponsModalOpen">
              <h2>Weapons played</h2>
              <template v-for="({ count, weapon_id: weaponId }) in idOrderedWeapons">
                <weapon-count :key="weaponId" :count="count" :weapon-id="weaponId" />
              </template>

              <h2 style="margin-top: 1em">Unused weapons</h2>
              <template v-for="weaponId in unusedWeaponIds">
                <main-weapon :key="weaponId" :weapon-id="weaponId" style="margin: 8px" />
              </template>
            </b-modal>

            <div class="table-wrap box is-fullwidth">
              <table class="is-hoverable is-fullwidth">
                <tbody>
                  <tr v-for="weapon in shiftSummary.weapons" :key="weapon.weapon_id">
                    <td><div class="is-flex"><main-weapon :weapon-id="weapon.weapon_id" /></div></td>
                    <td>
                      <p>
                        {{ weapon.count }}
                        <small>
                          ({{
                            (weapon.count / (summary.clear_waves + summary.games - summary.clear_games)) | percentage
                          }})
                        </small>
                      </p>
                      <p class="proportional-bar-chart-container">
                        <weapon-proportional-bar-chart
                          :value="weapon.count"
                          :max="shiftSummary.weapons[0].count"
                          :weapon="weapon.weapon_id"
                        />
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2>Special weapons</h2>

            <div class="table-wrap box is-fullwidth">
              <table class="is-hoverable is-fullwidth">
                <tbody>
                  <tr v-for="({ count, games, special_id }) in shiftSummary.specials" :key="special_id">
                    <td><div class="is-flex"><weapon weapon-type="special" :weapon-id="special_id" /></div></td>
                    <td>
                      <p>
                        {{ games }}
                        <small>({{ count }})</small>
                        <small>
                          ({{
                            (games / summary.games) | percentage
                          }})
                        </small>
                      </p>
                      <p class="proportional-bar-chart-container">
                        <weapon-proportional-bar-chart
                          :value="games"
                          :max="shiftSummary.specials[0].games"
                          :weapon="special_id"
                        />
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <section>
        <h2>Results</h2>
        <results :hide-schedule-heading="true" :raw-results="shiftSummary.results" :show-more-link="showMoreLink" />
      </section>
    </template>
  </require-fetch-template>
</template>

<style lang="scss" scoped>
@import '@/assets/bulma-variables.scss';
</style>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import MainWeapon from '@/components/MainWeapon.vue';
import RequireFetchBase from '@/components/RequireFetchBase.vue';
import RequireFetchTemplate from '@/components/RequireFetchTemplate.vue';
import Results from '@/components/Results.vue';
import ScheduleCard from '@/components/ScheduleCard.vue';
import ShiftDetails from '@/components/ShiftDetails.vue';
import Weapon from '@/components/Weapon.vue';
import WeaponCount from '@/components/WeaponCount.vue';
import WeaponProportionalBarChart from '@/components/WeaponProportionalBarChart.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import { playersModule } from '@/store/modules/players';
import { schedulesModule } from '@/store/modules/schedules';
import { hasRandomWeapon, isGrizzcoWeapon, percentage, toFixed, unique } from '@/helpers/helper';
import { rareWeaponIds, Schedule, UserData } from '@/types/salmon-stats';
import { idKeyMapModule } from '@/store/modules/id-key-map';

@Component({
  name: 'PlayerShifts',
  components: { MainWeapon, Weapon, RequireFetchTemplate, Results, ScheduleCard, ShiftDetails, WeaponCount, WeaponProportionalBarChart },
  filters: { percentage, toFixed },
  methods: { hasRandomWeapon },
})
export default class PlayerShifts extends RequireFetchBase {
  public normalizeFailedGame = false;
  public player: UserData | null = null;
  public schedule: Schedule | null = null;
  public isWeaponsModalOpen = false;

  get apiPath() {
    return `players/${this.playerId}/schedules/${this.scheduleId}`;
  }
  get availableWeapons() {
    const { weapons } = this.schedule!;
    if (weapons.includes(-2)) { // Golden "?"
      return rareWeaponIds.length;
    } else if (weapons.includes(-1)) { // Green "?"
      return idKeyMapModule.weaponIds.length - rareWeaponIds.length + 1;
    }

    return unique(weapons).length
  }
  get idOrderedWeapons() {
    return [...this.shiftSummary.weapons].sort((a: any, b: any) => a.weapon_id - b.weapon_id);
  }
  get playerId() {
    return this.$route.params.playerId;
  }
  get scheduleId() {
    return this.$route.params.scheduleId;
  }
  get shiftSummary() {
    return state.data;
  }
  get showMoreLink() {
    return {
      name: 'players.schedules.results',
      params: { scheduleId: this.scheduleId },
    };
  }
  get summary() {
    const summary = state.data.summary as Record<string, string>;
    const result: Record<string, string> = {};

    Object.entries(summary).forEach((pair) => {
      const [k, v] = pair;

      if (k.substr(0, 6) === 'player') {
        const key = k.substr(7);
        result[`team_${key}`] = v + summary[`others_${key}`];
        result[k] = v;
      } else {
        result[k] = v;
      }
    });

    return result;
  }
  get unusedWeaponIds() {
    const unusedWeaponds: number[] = [];
    const playedWeaponIds = (this.shiftSummary.weapons as Array<{ weapon_id: number }>).map((w) => w.weapon_id);
    if (!playedWeaponIds.some(isGrizzcoWeapon)) {
      unusedWeaponds.push(-1);
    }

    unusedWeaponds.push(...idKeyMapModule.weaponIds.filter((id) => !isGrizzcoWeapon(id) && !playedWeaponIds.includes(id)));

    return unusedWeaponds;
  }

  mounted() {
    state.fetch(this.apiPath);

    schedulesModule.fetchScheduleMetadata(this.scheduleId).then((schedule) => {
      this.schedule = schedule;
    });

    playersModule.fetchPlayer(this.playerId).then((player) => {
      this.player = player;
    });
  }
}
</script>

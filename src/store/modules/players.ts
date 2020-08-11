import { Mutation, Action, VuexModule, getModule, Module } from 'vuex-module-decorators';
import { UserData } from '@/types/salmon-stats';
import store from '@/store/store';
import apiCleint from '@/api-client';
import { parseRawUserData, unique } from '@/helpers/helper';

export type IPlayers = {
  players: Map<string, UserData>;
};

@Module({ dynamic: true, store, name: 'players', namespaced: true })
class Players extends VuexModule implements IPlayers {
  fetchingIds = new Set<string>();
  players = new Map<string, UserData>();

  @Action
  public async fetchPlayer(playerId: string): Promise<UserData> {
    const players = await this.fetchPlayers([playerId]);
    return players[0];
  }

  @Action
  public async fetchPlayers(playerIds: string[]): Promise<UserData[]> {
    const players = new Map(this.players);

    // TODO: client-side caching mechanism
    const uniquePlayerIds = unique(playerIds);
    const uncachedIds = uniquePlayerIds.filter((playerId) => !players.has(playerId));

    if (uncachedIds.length > 0) {
      const { data } = await apiCleint.get(`/players/metadata/?ids=${uncachedIds.join(',')}`);

      data.map((rawUser: any) => {
        const playerId = rawUser.player_id as string;
        players.set(playerId, parseRawUserData(rawUser));
      });
    }

    this.SET_PLAYERS(players);

    return playerIds.map((id) => players.get(id)!);
  }

  @Mutation
  private SET_PLAYERS(playersToAdd: Map<string, UserData>) {
    this.players = new Map([...this.players, ...playersToAdd]);
  }
}

export const playersModule = getModule(Players);

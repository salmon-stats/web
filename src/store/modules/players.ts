import { Mutation, Action, VuexModule, getModule, Module } from 'vuex-module-decorators';
import { UserData } from '@/types/salmon-stats';
import store from '@/store/store';
import apiCleint from '@/api-client';
import { parseRawUserData } from '@/helper';

export interface IPlayers {
  players: Map<string, object>;
}

@Module({ dynamic: true, store, name: 'players', namespaced: true })
class Players extends VuexModule implements IPlayers {
  fetchingIds = new Set<string>();
  players = new Map<string, UserData>();

  @Action
  public setPlayerData(rawUser: any) {
    this.SET_PLAYER_USER_DATA({ playerId: rawUser.player_id, rawUser });
  }

  @Action
  public async fetchPlayer(playerId: string): Promise<UserData> {
    return (await this.fetchPlayers([playerId]))[0];
  }

  @Action
  public async fetchPlayers(playerIds: string[]): Promise<UserData[]> {
    // TODO: client-side fetching mechanism

    const cachedIds = playerIds.filter((playerId) => this.players.has(playerId));
    const cachedUsers: UserData[] = cachedIds.map((playerId) => this.players.get(playerId)!);
    const uncachedIds = playerIds.filter((playerId) => !this.players.has(playerId));
    let fetchedUsers: UserData[] = [];

    if (uncachedIds.length > 0) {
      const res = await apiCleint.get(`/players/metadata/?ids=${uncachedIds.join(',')}`);

      fetchedUsers = res.data.map((rawUser: any) => {
        const playerId = rawUser.player_id as string;
        this.SET_PLAYER_USER_DATA({ playerId, rawUser });

        return this.players.get(playerId);
      });
    }

    if (fetchedUsers.length === 0) {
      return cachedUsers;
    }
    else if (cachedUsers.length === 0) {
      return fetchedUsers;
    }

    return [...cachedUsers, ...fetchedUsers];
  }

  @Mutation
  private SET_PLAYER_USER_DATA(options: { playerId: string, rawUser: any }) {
    const { playerId, rawUser } = options;

    this.players.set(playerId, parseRawUserData(rawUser));
  }
}

export const playersModule = getModule(Players);

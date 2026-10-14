import type { FetchResult } from '@skyra/safe-fetch';
import type { APIOptions } from '../base.js';
import { WiredRoomBase } from './base.js';
import { WiredFurniProfile } from './furni-profile.js';
import { WiredFurniVariable } from './furni-variable.js';
import { WiredGlobalProfile } from './global-profile.js';
import { WiredGlobalVariable } from './global-variable.js';
import {
	WiredUserTargetKind,
	type WiredFurniProfileData,
	type WiredProfileData,
	type WiredRoomVariables,
	type WiredUserProfileData
} from './types.js';
import { WiredUserProfile } from './user-profile.js';
import { WiredUserVariable } from './user-variable.js';
import { formatFurniPath, parseWiredJson } from './utils.js';

export class WiredRoomAPI extends WiredRoomBase {
	/**
	 * Get the names of the wired variables configured in the room, grouped by scope
	 *
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const names = (await room.getVariableNames()).unwrap();
	 * console.log(names.users, names.furni, names.global);
	 * ```
	 */
	public getVariableNames(options?: APIOptions): Promise<FetchResult<WiredRoomVariables>> {
		const url = this.formatRoomURL('variables');
		return parseWiredJson<WiredRoomVariables>(this.fetchGet(url, options, this.readHeaders()));
	}

	/**
	 * Delete every stored value of the given user and furni variables, keeping the variables configured
	 *
	 * @remarks Bulk deletion must be enabled for the room.
	 *
	 * @param variableNames - The names of the variables to clear
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * // Clear every score and streak in the room
	 * await room.bulkDeleteVariables(['score', 'streak']);
	 * ```
	 */
	public bulkDeleteVariables(variableNames: readonly string[], options?: APIOptions): Promise<FetchResult<Response>> {
		const url = this.formatRoomURL('variables/bulk-delete');
		return this.fetchPost(url, { variables: variableNames }, options, this.writeHeaders());
	}

	/**
	 * Get a handle for a user variable, held by users, pets, and bots
	 *
	 * @param variableName - The name of the variable
	 *
	 * @example
	 * ```ts
	 * const score = room.userVariable('score');
	 * await score.users.set(44, 10n);
	 * await score.pets.set(12, 3n);
	 * ```
	 */
	public userVariable(variableName: string): WiredUserVariable {
		return new WiredUserVariable(this.baseURL, this.timeout, this.roomId, this.keys, variableName);
	}

	/**
	 * Get a handle for a furni variable, held by floor and wall items
	 *
	 * @param variableName - The name of the variable
	 *
	 * @example
	 * ```ts
	 * const open = room.furniVariable('open');
	 * await open.set(5521, 1n);
	 * await open.update(-91, 0n);
	 * ```
	 */
	public furniVariable(variableName: string): WiredFurniVariable {
		return new WiredFurniVariable(this.baseURL, this.timeout, this.roomId, this.keys, variableName);
	}

	/**
	 * Get a handle for a global variable, held by the room
	 *
	 * @param variableName - The name of the variable
	 *
	 * @example
	 * ```ts
	 * const round = room.globalVariable('round');
	 * await round.update(3n);
	 * ```
	 */
	public globalVariable(variableName: string): WiredGlobalVariable {
		return new WiredGlobalVariable(this.baseURL, this.timeout, this.roomId, this.keys, variableName);
	}

	/**
	 * Get the variables held by a user given their in-room ID
	 *
	 * @param entityId - The in-room ID of the user
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const profile = (await room.getUserProfile(44)).unwrap();
	 * console.log(profile.name, profile.get('score'));
	 * ```
	 */
	public getUserProfile(entityId: number, options?: APIOptions): Promise<FetchResult<WiredUserProfile>> {
		return this.#getUserKindProfile(this.formatRoomURL(`variables_profile/user/${WiredUserTargetKind.USERS}/${entityId}`), options);
	}

	/**
	 * Get the variables held by a user given their username
	 *
	 * @param username - The username of the user
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const profile = (await room.getUserProfileByName('-tobi-talent-')).unwrap();
	 * console.log(profile.id, profile.get('score'));
	 * ```
	 */
	public getUserProfileByName(username: string, options?: APIOptions): Promise<FetchResult<WiredUserProfile>> {
		const url = this.formatRoomURL('variables_profile/user/users');
		url.searchParams.set('name', username);
		return this.#getUserKindProfile(url, options);
	}

	/**
	 * Get the variables held by a user given their unique ID
	 *
	 * @param uniqueId - The unique ID of the user
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const user = (await habbo.users.getByUsername('-tobi-talent-')).unwrap();
	 * const profile = (await room.getUserProfileByUniqueId(user.uniqueId)).unwrap();
	 * ```
	 */
	public getUserProfileByUniqueId(uniqueId: string, options?: APIOptions): Promise<FetchResult<WiredUserProfile>> {
		const url = this.formatRoomURL('variables_profile/user/users');
		url.searchParams.set('unique_id', uniqueId);
		return this.#getUserKindProfile(url, options);
	}

	/**
	 * Get the variables held by a pet
	 *
	 * @param entityId - The in-room ID of the pet
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const profile = (await room.getPetProfile(12)).unwrap();
	 * console.log(profile.name, profile.variables);
	 * ```
	 */
	public getPetProfile(entityId: number, options?: APIOptions): Promise<FetchResult<WiredUserProfile>> {
		return this.#getUserKindProfile(this.formatRoomURL(`variables_profile/user/${WiredUserTargetKind.PETS}/${entityId}`), options);
	}

	/**
	 * Get the variables held by a bot
	 *
	 * @param entityId - The in-room ID of the bot
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const profile = (await room.getBotProfile(3)).unwrap();
	 * console.log(profile.name, profile.variables);
	 * ```
	 */
	public getBotProfile(entityId: number, options?: APIOptions): Promise<FetchResult<WiredUserProfile>> {
		return this.#getUserKindProfile(this.formatRoomURL(`variables_profile/user/${WiredUserTargetKind.BOTS}/${entityId}`), options);
	}

	/**
	 * Get the variables held by a floor or wall item
	 *
	 * @param furniId - The ID of the item as seen in the client, see {@linkcode toWiredFurniTarget}
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const profile = (await room.getFurniProfile(-91)).unwrap();
	 * console.log(profile.furniId, profile.get('open'));
	 * ```
	 */
	public async getFurniProfile(furniId: number, options?: APIOptions): Promise<FetchResult<WiredFurniProfile>> {
		const url = this.formatRoomURL(`variables_profile/furni/${formatFurniPath(furniId)}`);
		const result = await parseWiredJson<WiredFurniProfileData>(this.fetchGet(url, options, this.readHeaders()));
		return result.map((data) => new WiredFurniProfile(this.baseURL, this.timeout, this.roomId, this.keys, data));
	}

	/**
	 * Get the global variables of the room
	 *
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const profile = (await room.getGlobalProfile()).unwrap();
	 * console.log(profile.get('round'));
	 * ```
	 */
	public async getGlobalProfile(options?: APIOptions): Promise<FetchResult<WiredGlobalProfile>> {
		const url = this.formatRoomURL('variables_profile/global');
		const result = await parseWiredJson<WiredProfileData>(this.fetchGet(url, options, this.readHeaders()));
		return result.map((data) => new WiredGlobalProfile(this.baseURL, this.timeout, this.roomId, this.keys, data));
	}

	async #getUserKindProfile(url: URL, options: APIOptions | undefined): Promise<FetchResult<WiredUserProfile>> {
		const result = await parseWiredJson<WiredUserProfileData>(this.fetchGet(url, options, this.readHeaders()));
		return result.map((data) => new WiredUserProfile(this.baseURL, this.timeout, this.roomId, this.keys, data));
	}
}

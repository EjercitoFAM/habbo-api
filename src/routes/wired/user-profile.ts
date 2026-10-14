import type { FetchResult } from '@skyra/safe-fetch';
import type { APIOptions } from '../base.js';
import { WiredProfile } from './profile.js';
import { WiredUserTargetKind, type WiredRoomKeys, type WiredUserProfileData, type WiredVariableValueInput } from './types.js';
import { formatVariables, parseWiredJson } from './utils.js';

/**
 * The variables held by a user, pet, or bot.
 */
export class WiredUserProfile extends WiredProfile {
	/**
	 * The kind of the entity
	 */
	public readonly targetKind: WiredUserTargetKind;

	/**
	 * The in-room ID of the entity
	 */
	public readonly id: number;

	/**
	 * The name of the entity, if the API reported it
	 */
	public readonly name: string | null;

	/**
	 * The unique ID of the user, `null` for pets and bots
	 */
	public readonly uniqueId: string | null;

	public constructor(baseURL: string, timeout: number | null | undefined, roomId: number, keys: WiredRoomKeys, data: WiredUserProfileData) {
		super(baseURL, timeout, roomId, keys, data);
		if ('user' in data) {
			this.targetKind = WiredUserTargetKind.USERS;
			this.id = data.user.id;
			this.name = data.user.name ?? null;
			this.uniqueId = data.user.unique_id ?? null;
		} else if ('pet' in data) {
			this.targetKind = WiredUserTargetKind.PETS;
			this.id = data.pet.id;
			this.name = data.pet.name ?? null;
			this.uniqueId = null;
		} else {
			this.targetKind = WiredUserTargetKind.BOTS;
			this.id = data.bot.id;
			this.name = data.bot.name ?? null;
			this.uniqueId = null;
		}
	}

	/**
	 * Update several variables of the entity at once, resolving to the updated profile
	 *
	 * @param variables - The new values by variable name, `null` deleting the value
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const profile = (await room.getUserProfileByName('-tobi-talent-')).unwrap();
	 * const updated = (await profile.update({ score: (profile.get('score') ?? 0n) + 1n, streak: null })).unwrap();
	 * ```
	 */
	public async update(
		variables: Readonly<Record<string, WiredVariableValueInput | null>>,
		options?: APIOptions
	): Promise<FetchResult<WiredUserProfile>> {
		const url = this.#formatProfileURL();
		const result = await parseWiredJson<WiredUserProfileData>(
			this.fetchPatch(url, { variables: formatVariables(variables) }, options, this.writeHeaders())
		);
		return result.map((data) => new WiredUserProfile(this.baseURL, this.timeout, this.roomId, this.keys, data));
	}

	/**
	 * Delete every variable value held by the entity
	 *
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const profile = (await room.getPetProfile(12)).unwrap();
	 * await profile.delete();
	 * ```
	 */
	public delete(options?: APIOptions): Promise<FetchResult<Response>> {
		return this.fetchDelete(this.#formatProfileURL(), options, this.writeHeaders());
	}

	#formatProfileURL(): URL {
		return this.formatRoomURL(`variables_profile/user/${this.targetKind}/${this.id}`);
	}
}

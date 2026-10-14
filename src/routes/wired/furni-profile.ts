import type { FetchResult } from '@skyra/safe-fetch';
import type { APIOptions } from '../base.js';
import { fromWiredFurniEntity } from './furni-id.js';
import { WiredProfile } from './profile.js';
import type { WiredFurniProfileData, WiredRoomKeys, WiredVariableValueInput } from './types.js';
import { formatFurniPath, formatVariables, parseWiredJson } from './utils.js';

/**
 * The variables held by a floor or wall item.
 */
export class WiredFurniProfile extends WiredProfile {
	/**
	 * The ID of the item as seen in the client, negative for wall items, see {@linkcode toWiredFurniTarget}
	 */
	public readonly furniId: number;

	public constructor(baseURL: string, timeout: number | null | undefined, roomId: number, keys: WiredRoomKeys, data: WiredFurniProfileData) {
		super(baseURL, timeout, roomId, keys, data);
		this.furniId = fromWiredFurniEntity(data);
	}

	/**
	 * Update several variables of the item at once, resolving to the updated profile
	 *
	 * @param variables - The new values by variable name, `null` deleting the value
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const profile = (await room.getFurniProfile(-91)).unwrap();
	 * await profile.update({ open: 1n, uses: (profile.get('uses') ?? 0n) + 1n });
	 * ```
	 */
	public async update(
		variables: Readonly<Record<string, WiredVariableValueInput | null>>,
		options?: APIOptions
	): Promise<FetchResult<WiredFurniProfile>> {
		const url = this.formatRoomURL(`variables_profile/furni/${formatFurniPath(this.furniId)}`);
		const result = await parseWiredJson<WiredFurniProfileData>(
			this.fetchPatch(url, { variables: formatVariables(variables) }, options, this.writeHeaders())
		);
		return result.map((data) => new WiredFurniProfile(this.baseURL, this.timeout, this.roomId, this.keys, data));
	}
}

import type { FetchResult } from '@skyra/safe-fetch';
import type { APIOptions } from '../base.js';
import { WiredProfile } from './profile.js';
import type { WiredProfileData, WiredVariableValueInput } from './types.js';
import { formatVariables, parseWiredJson } from './utils.js';

/**
 * The global variables of a room.
 */
export class WiredGlobalProfile extends WiredProfile {
	/**
	 * Update several global variables at once, resolving to the updated profile
	 *
	 * @param variables - The new values by variable name
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const profile = (await room.getGlobalProfile()).unwrap();
	 * await profile.update({ round: (profile.get('round') ?? 0n) + 1n, timer: 60n });
	 * ```
	 */
	public async update(
		variables: Readonly<Record<string, WiredVariableValueInput>>,
		options?: APIOptions
	): Promise<FetchResult<WiredGlobalProfile>> {
		const url = this.formatRoomURL('variables_profile/global');
		const result = await parseWiredJson<WiredProfileData>(
			this.fetchPatch(url, { variables: formatVariables(variables) }, options, this.writeHeaders())
		);
		return result.map((data) => new WiredGlobalProfile(this.baseURL, this.timeout, this.roomId, this.keys, data));
	}
}

import type { FetchResult } from '@skyra/safe-fetch';
import type { APIOptions } from '../base.js';
import { WiredRoomBase } from './base.js';
import type { WiredRoomKeys, WiredVariable, WiredVariableValueInput } from './types.js';
import { parseWiredJson } from './utils.js';

export class WiredGlobalVariable extends WiredRoomBase {
	public readonly name: string;

	public constructor(baseURL: string, timeout: number | null | undefined, roomId: number, keys: WiredRoomKeys, name: string) {
		super(baseURL, timeout, roomId, keys);
		this.name = name;
	}

	/**
	 * Get the value of the variable
	 *
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const { value } = (await room.globalVariable('round').get()).unwrap();
	 * ```
	 */
	public get(options?: APIOptions): Promise<FetchResult<WiredVariable>> {
		const url = this.formatRoomURL(`variables/global/${encodeURIComponent(this.name)}`);
		return parseWiredJson<WiredVariable>(this.fetchGet(url, options, this.readHeaders()));
	}

	/**
	 * Update the value of the variable
	 *
	 * @param value - The new value
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const round = room.globalVariable('round');
	 * const { value } = (await round.get()).unwrap();
	 * await round.update(value + 1n);
	 * ```
	 */
	public update(value: WiredVariableValueInput, options?: APIOptions): Promise<FetchResult<WiredVariable>> {
		const url = this.formatRoomURL(`variables/global/${encodeURIComponent(this.name)}`);
		return parseWiredJson<WiredVariable>(this.fetchPatch(url, { value: String(value) }, options, this.writeHeaders()));
	}
}

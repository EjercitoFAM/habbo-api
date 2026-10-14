import type { FetchResult } from '@skyra/safe-fetch';
import type { APIOptions } from '../base.js';
import { WiredRoomBase } from './base.js';
import { WiredFurniBatchBuilder } from './batch.js';
import {
	WiredFurniTargetKind,
	type WiredFurniEntity,
	type WiredListOptions,
	type WiredRoomKeys,
	type WiredVariable,
	type WiredVariableCount,
	type WiredVariablePage,
	type WiredVariableValueInput
} from './types.js';
import { formatFurniPath, parseWiredJson } from './utils.js';

export class WiredFurniVariable extends WiredRoomBase {
	public readonly name: string;

	/**
	 * The variable as held by floor items
	 */
	public readonly furni: WiredFurniKindVariable;

	/**
	 * The variable as held by Builders Club floor items
	 */
	public readonly furniBC: WiredFurniKindVariable;

	/**
	 * The variable as held by wall items
	 */
	public readonly wallItems: WiredFurniKindVariable;

	/**
	 * The variable as held by Builders Club wall items
	 */
	public readonly wallItemsBC: WiredFurniKindVariable;

	public constructor(baseURL: string, timeout: number | null | undefined, roomId: number, keys: WiredRoomKeys, name: string) {
		super(baseURL, timeout, roomId, keys);
		this.name = name;
		this.furni = new WiredFurniKindVariable(baseURL, timeout, roomId, keys, name, WiredFurniTargetKind.FURNI);
		this.furniBC = new WiredFurniKindVariable(baseURL, timeout, roomId, keys, name, WiredFurniTargetKind.FURNI_BC);
		this.wallItems = new WiredFurniKindVariable(baseURL, timeout, roomId, keys, name, WiredFurniTargetKind.WALL_ITEMS);
		this.wallItemsBC = new WiredFurniKindVariable(baseURL, timeout, roomId, keys, name, WiredFurniTargetKind.WALL_ITEMS_BC);
	}

	/**
	 * Get the value held by a floor or wall item
	 *
	 * @param furniId - The ID of the item as seen in the client, see {@linkcode toWiredFurniTarget}
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * // Wall items have negative IDs in the client, this reads `wall-items/91`
	 * const result = await room.furniVariable('open').get(-91);
	 * ```
	 */
	public get(furniId: number, options?: APIOptions): Promise<FetchResult<WiredVariable>> {
		const url = this.#formatItemURL(furniId);
		return parseWiredJson<WiredVariable>(this.fetchGet(url, options, this.readHeaders()));
	}

	/**
	 * Set the value for a floor or wall item, assigning the variable if the item does not hold it yet
	 *
	 * @param furniId - The ID of the item as seen in the client, see {@linkcode toWiredFurniTarget}
	 * @param value - The new value
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * await room.furniVariable('open').set(5521, 1n);
	 * ```
	 */
	public set(furniId: number, value: WiredVariableValueInput, options?: APIOptions): Promise<FetchResult<WiredVariable>> {
		const url = this.#formatItemURL(furniId);
		return parseWiredJson<WiredVariable>(this.fetchPut(url, { value: String(value) }, options, this.writeHeaders()));
	}

	/**
	 * Update the value already held by a floor or wall item
	 *
	 * @param furniId - The ID of the item as seen in the client, see {@linkcode toWiredFurniTarget}
	 * @param value - The new value
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * await room.furniVariable('open').update(-91, 0n);
	 * ```
	 */
	public update(furniId: number, value: WiredVariableValueInput, options?: APIOptions): Promise<FetchResult<WiredVariable>> {
		const url = this.#formatItemURL(furniId);
		return parseWiredJson<WiredVariable>(this.fetchPatch(url, { value: String(value) }, options, this.writeHeaders()));
	}

	/**
	 * Delete the value held by a floor or wall item
	 *
	 * @param furniId - The ID of the item as seen in the client, see {@linkcode toWiredFurniTarget}
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * await room.furniVariable('open').delete(5521);
	 * ```
	 */
	public delete(furniId: number, options?: APIOptions): Promise<FetchResult<Response>> {
		const url = this.#formatItemURL(furniId);
		return this.fetchDelete(url, options, this.writeHeaders());
	}

	/**
	 * Start a batch of up to {@linkcode WiredBatchMaxOperations} operations, sent with {@linkcode WiredBatchBuilder.execute}
	 *
	 * @example
	 * ```ts
	 * await room.furniVariable('open').batch().set(5521, 1n).set(-91, 1n).delete(5522).execute();
	 * ```
	 */
	public batch(): WiredFurniBatchBuilder {
		return new WiredFurniBatchBuilder(this.baseURL, this.timeout, this.roomId, this.keys, this.name);
	}

	#formatItemURL(furniId: number): URL {
		return this.formatRoomURL(`variables/furni/${encodeURIComponent(this.name)}/${formatFurniPath(furniId)}`);
	}
}

/**
 * A furni variable as held by one kind of item. Single items are read and written through {@linkcode WiredFurniVariable},
 * which infers the kind from the item's ID.
 */
export class WiredFurniKindVariable extends WiredRoomBase {
	public readonly name: string;
	public readonly targetKind: WiredFurniTargetKind;

	public constructor(
		baseURL: string,
		timeout: number | null | undefined,
		roomId: number,
		keys: WiredRoomKeys,
		name: string,
		targetKind: WiredFurniTargetKind
	) {
		super(baseURL, timeout, roomId, keys);
		this.name = name;
		this.targetKind = targetKind;
	}

	/**
	 * Get a page of the values held by items of this kind
	 *
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const page = (await room.furniVariable('open').wallItems.getValues({ page: 1 })).unwrap();
	 * // The items' IDs as seen in the client, negative for wall items
	 * const furniIds = page.items.map((entry) => fromWiredFurniEntity(entry));
	 * ```
	 */
	public getValues(options?: WiredListOptions): Promise<FetchResult<WiredVariablePage<WiredFurniEntity>>> {
		const url = this.formatListURL(`variables/furni/${encodeURIComponent(this.name)}/${this.targetKind}`, options);
		return parseWiredJson<WiredVariablePage<WiredFurniEntity>>(this.fetchGet(url, options, this.readHeaders()));
	}

	/**
	 * Count the items of this kind holding the variable
	 *
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const { count } = (await room.furniVariable('open').furni.count()).unwrap();
	 * ```
	 */
	public count(options?: APIOptions): Promise<FetchResult<WiredVariableCount>> {
		const url = this.formatRoomURL(`variables/furni/${encodeURIComponent(this.name)}/${this.targetKind}/count`);
		return parseWiredJson<WiredVariableCount>(this.fetchGet(url, options, this.readHeaders()));
	}
}

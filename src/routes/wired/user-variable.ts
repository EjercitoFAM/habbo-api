import type { FetchResult } from '@skyra/safe-fetch';
import type { APIOptions } from '../base.js';
import { WiredRoomBase } from './base.js';
import { WiredUserBatchBuilder } from './batch.js';
import {
	WiredUserTargetKind,
	type WiredListOptions,
	type WiredRoomKeys,
	type WiredUserEntity,
	type WiredVariable,
	type WiredVariableCount,
	type WiredVariablePage,
	type WiredVariableValueInput
} from './types.js';
import { parseWiredJson } from './utils.js';

export class WiredUserVariable extends WiredRoomBase {
	public readonly name: string;

	/**
	 * The variable as held by users
	 */
	public readonly users: WiredUserKindVariable;

	/**
	 * The variable as held by pets
	 */
	public readonly pets: WiredUserKindVariable;

	/**
	 * The variable as held by bots
	 */
	public readonly bots: WiredUserKindVariable;

	public constructor(baseURL: string, timeout: number | null | undefined, roomId: number, keys: WiredRoomKeys, name: string) {
		super(baseURL, timeout, roomId, keys);
		this.name = name;
		this.users = new WiredUserKindVariable(baseURL, timeout, roomId, keys, name, WiredUserTargetKind.USERS);
		this.pets = new WiredUserKindVariable(baseURL, timeout, roomId, keys, name, WiredUserTargetKind.PETS);
		this.bots = new WiredUserKindVariable(baseURL, timeout, roomId, keys, name, WiredUserTargetKind.BOTS);
	}

	/**
	 * Start a batch of up to {@linkcode WiredBatchMaxOperations} operations, sent with {@linkcode WiredBatchBuilder.execute}
	 *
	 * @example
	 * ```ts
	 * const result = await room
	 * 	.userVariable('score')
	 * 	.batch()
	 * 	.getUser(44, { opId: 'before' })
	 * 	.updateUser(44, 15n)
	 * 	.deletePet(12)
	 * 	.execute();
	 * ```
	 */
	public batch(): WiredUserBatchBuilder {
		return new WiredUserBatchBuilder(this.baseURL, this.timeout, this.roomId, this.keys, this.name);
	}
}

export class WiredUserKindVariable extends WiredRoomBase {
	public readonly name: string;
	public readonly targetKind: WiredUserTargetKind;

	public constructor(
		baseURL: string,
		timeout: number | null | undefined,
		roomId: number,
		keys: WiredRoomKeys,
		name: string,
		targetKind: WiredUserTargetKind
	) {
		super(baseURL, timeout, roomId, keys);
		this.name = name;
		this.targetKind = targetKind;
	}

	/**
	 * Get the value held by an entity
	 *
	 * @param entityId - The in-room ID of the entity
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const result = await room.userVariable('score').users.get(44);
	 * if (result.isOk()) console.log(result.unwrap().value); // 10n
	 * ```
	 */
	public get(entityId: number, options?: APIOptions): Promise<FetchResult<WiredVariable>> {
		const url = this.#formatEntityURL(entityId);
		return parseWiredJson<WiredVariable>(this.fetchGet(url, options, this.readHeaders()));
	}

	/**
	 * Set the value for an entity, assigning the variable if the entity does not hold it yet
	 *
	 * @param entityId - The in-room ID of the entity
	 * @param value - The new value
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * await room.userVariable('score').pets.set(12, 7n);
	 * ```
	 */
	public set(entityId: number, value: WiredVariableValueInput, options?: APIOptions): Promise<FetchResult<WiredVariable>> {
		const url = this.#formatEntityURL(entityId);
		return parseWiredJson<WiredVariable>(this.fetchPut(url, { value: String(value) }, options, this.writeHeaders()));
	}

	/**
	 * Update the value already held by an entity
	 *
	 * @param entityId - The in-room ID of the entity
	 * @param value - The new value
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * await room.userVariable('score').users.update(44, 15n);
	 * ```
	 */
	public update(entityId: number, value: WiredVariableValueInput, options?: APIOptions): Promise<FetchResult<WiredVariable>> {
		const url = this.#formatEntityURL(entityId);
		return parseWiredJson<WiredVariable>(this.fetchPatch(url, { value: String(value) }, options, this.writeHeaders()));
	}

	/**
	 * Delete the value held by an entity
	 *
	 * @param entityId - The in-room ID of the entity
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * await room.userVariable('score').bots.delete(3);
	 * ```
	 */
	public delete(entityId: number, options?: APIOptions): Promise<FetchResult<Response>> {
		const url = this.#formatEntityURL(entityId);
		return this.fetchDelete(url, options, this.writeHeaders());
	}

	/**
	 * Get a page of the values held by entities of this kind
	 *
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * // The top 10 users by score
	 * const options = { orderBy: 'value', orderDirection: 'desc', size: 10 } as const;
	 * const page = (await room.userVariable('score').users.getValues(options)).unwrap();
	 * ```
	 */
	public getValues(options?: WiredListOptions): Promise<FetchResult<WiredVariablePage<WiredUserEntity>>> {
		const url = this.formatListURL(`variables/user/${encodeURIComponent(this.name)}/${this.targetKind}`, options);
		return parseWiredJson<WiredVariablePage<WiredUserEntity>>(this.fetchGet(url, options, this.readHeaders()));
	}

	/**
	 * Count the entities of this kind holding the variable
	 *
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const { count } = (await room.userVariable('score').users.count()).unwrap();
	 * ```
	 */
	public count(options?: APIOptions): Promise<FetchResult<WiredVariableCount>> {
		const url = this.formatRoomURL(`variables/user/${encodeURIComponent(this.name)}/${this.targetKind}/count`);
		return parseWiredJson<WiredVariableCount>(this.fetchGet(url, options, this.readHeaders()));
	}

	#formatEntityURL(entityId: number): URL {
		return this.formatRoomURL(`variables/user/${encodeURIComponent(this.name)}/${this.targetKind}/${entityId}`);
	}
}

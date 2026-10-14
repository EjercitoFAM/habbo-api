import type { FetchResult } from '@skyra/safe-fetch';
import { isNullish } from '../../common.js';
import type { APIOptions } from '../base.js';
import { WiredRoomBase } from './base.js';
import {
	WiredUserTargetKind,
	type WiredBatchOperationOptions,
	type WiredBatchRequestOperation,
	type WiredBatchResults,
	type WiredRoomKeys,
	type WiredVariableValueInput
} from './types.js';
import { formatFurniPath, parseWiredJson } from './utils.js';

/**
 * The maximum amount of operations a batch accepts.
 */
export const WiredBatchMaxOperations = 50;

export abstract class WiredBatchBuilder extends WiredRoomBase {
	public readonly variableName: string;
	readonly #scope: 'user' | 'furni';
	readonly #requests: WiredBatchRequestOperation[] = [];

	protected constructor(
		baseURL: string,
		timeout: number | null | undefined,
		roomId: number,
		keys: WiredRoomKeys,
		variableName: string,
		scope: 'user' | 'furni'
	) {
		super(baseURL, timeout, roomId, keys);
		this.variableName = variableName;
		this.#scope = scope;
	}

	/**
	 * A copy of the operations added so far, in the form the API takes them
	 *
	 * @example
	 * ```ts
	 * // Build the operations without sending them
	 * const { requests } = room.userVariable('score').batch().getUser(44).setPet(12, 7n);
	 * // [{ method: 'GET', path: 'users/44' }, { method: 'PUT', path: 'pets/12', body: { value: '7' } }]
	 * ```
	 */
	public get requests(): WiredBatchRequestOperation[] {
		return [...this.#requests];
	}

	/**
	 * Send the batch
	 *
	 * @param options - The options for the API call
	 *
	 * @example
	 * ```ts
	 * const { results } = (await room.userVariable('score').batch().getUser(44, { opId: 'a' }).execute()).unwrap();
	 * for (const result of results) {
	 * 	if (result.status === 200) console.log(result.op_id, result.body.value);
	 * }
	 * ```
	 */
	public execute(options?: APIOptions): Promise<FetchResult<WiredBatchResults>> {
		const url = this.formatRoomURL(`variables/${this.#scope}/${encodeURIComponent(this.variableName)}/batch`);
		const headers = { ...this.readHeaders(), ...this.writeHeaders() };
		return parseWiredJson<WiredBatchResults>(this.fetchPost(url, { requests: this.#requests }, options, headers));
	}

	protected addRequest(
		method: WiredBatchRequestOperation['method'],
		path: string,
		value: WiredVariableValueInput | null,
		options: WiredBatchOperationOptions | undefined
	): this {
		if (this.#requests.length >= WiredBatchMaxOperations) {
			throw new RangeError(`A wired batch cannot have more than ${WiredBatchMaxOperations} operations`);
		}

		const request: WiredBatchRequestOperation = { method, path };
		if (!isNullish(options?.opId)) request.op_id = options.opId;
		if (value !== null) request.body = { value: String(value) };
		this.#requests.push(request);
		return this;
	}
}

export class WiredUserBatchBuilder extends WiredBatchBuilder {
	public constructor(baseURL: string, timeout: number | null | undefined, roomId: number, keys: WiredRoomKeys, variableName: string) {
		super(baseURL, timeout, roomId, keys, variableName, 'user');
	}

	/**
	 * Add a read of the value held by a user
	 *
	 * @param entityId - The in-room ID of the user
	 * @param options - The options for the operation
	 *
	 * @example
	 * ```ts
	 * room.userVariable('score').batch().getUser(44);
	 * ```
	 */
	public getUser(entityId: number, options?: WiredBatchOperationOptions): this {
		return this.addRequest('GET', `${WiredUserTargetKind.USERS}/${entityId}`, null, options);
	}

	/**
	 * Add a write of the value for a user, assigning the variable if the user does not hold it yet
	 *
	 * @param entityId - The in-room ID of the user
	 * @param value - The new value
	 * @param options - The options for the operation
	 *
	 * @example
	 * ```ts
	 * room.userVariable('score').batch().setUser(44, 10n);
	 * ```
	 */
	public setUser(entityId: number, value: WiredVariableValueInput, options?: WiredBatchOperationOptions): this {
		return this.addRequest('PUT', `${WiredUserTargetKind.USERS}/${entityId}`, value, options);
	}

	/**
	 * Add an update of the value already held by a user
	 *
	 * @param entityId - The in-room ID of the user
	 * @param value - The new value
	 * @param options - The options for the operation
	 *
	 * @example
	 * ```ts
	 * room.userVariable('score').batch().updateUser(44, 15n);
	 * ```
	 */
	public updateUser(entityId: number, value: WiredVariableValueInput, options?: WiredBatchOperationOptions): this {
		return this.addRequest('PATCH', `${WiredUserTargetKind.USERS}/${entityId}`, value, options);
	}

	/**
	 * Add a deletion of the value held by a user
	 *
	 * @param entityId - The in-room ID of the user
	 * @param options - The options for the operation
	 *
	 * @example
	 * ```ts
	 * room.userVariable('score').batch().deleteUser(44);
	 * ```
	 */
	public deleteUser(entityId: number, options?: WiredBatchOperationOptions): this {
		return this.addRequest('DELETE', `${WiredUserTargetKind.USERS}/${entityId}`, null, options);
	}

	/**
	 * Add a read of the value held by a pet
	 *
	 * @param entityId - The in-room ID of the pet
	 * @param options - The options for the operation
	 *
	 * @example
	 * ```ts
	 * room.userVariable('score').batch().getPet(44);
	 * ```
	 */
	public getPet(entityId: number, options?: WiredBatchOperationOptions): this {
		return this.addRequest('GET', `${WiredUserTargetKind.PETS}/${entityId}`, null, options);
	}

	/**
	 * Add a write of the value for a pet, assigning the variable if the pet does not hold it yet
	 *
	 * @param entityId - The in-room ID of the pet
	 * @param value - The new value
	 * @param options - The options for the operation
	 *
	 * @example
	 * ```ts
	 * room.userVariable('score').batch().setPet(44, 10n);
	 * ```
	 */
	public setPet(entityId: number, value: WiredVariableValueInput, options?: WiredBatchOperationOptions): this {
		return this.addRequest('PUT', `${WiredUserTargetKind.PETS}/${entityId}`, value, options);
	}

	/**
	 * Add an update of the value already held by a pet
	 *
	 * @param entityId - The in-room ID of the pet
	 * @param value - The new value
	 * @param options - The options for the operation
	 *
	 * @example
	 * ```ts
	 * room.userVariable('score').batch().updatePet(44, 15n);
	 * ```
	 */
	public updatePet(entityId: number, value: WiredVariableValueInput, options?: WiredBatchOperationOptions): this {
		return this.addRequest('PATCH', `${WiredUserTargetKind.PETS}/${entityId}`, value, options);
	}

	/**
	 * Add a deletion of the value held by a pet
	 *
	 * @param entityId - The in-room ID of the pet
	 * @param options - The options for the operation
	 *
	 * @example
	 * ```ts
	 * room.userVariable('score').batch().deletePet(44);
	 * ```
	 */
	public deletePet(entityId: number, options?: WiredBatchOperationOptions): this {
		return this.addRequest('DELETE', `${WiredUserTargetKind.PETS}/${entityId}`, null, options);
	}

	/**
	 * Add a read of the value held by a bot
	 *
	 * @param entityId - The in-room ID of the bot
	 * @param options - The options for the operation
	 *
	 * @example
	 * ```ts
	 * room.userVariable('score').batch().getBot(44);
	 * ```
	 */
	public getBot(entityId: number, options?: WiredBatchOperationOptions): this {
		return this.addRequest('GET', `${WiredUserTargetKind.BOTS}/${entityId}`, null, options);
	}

	/**
	 * Add a write of the value for a bot, assigning the variable if the bot does not hold it yet
	 *
	 * @param entityId - The in-room ID of the bot
	 * @param value - The new value
	 * @param options - The options for the operation
	 *
	 * @example
	 * ```ts
	 * room.userVariable('score').batch().setBot(44, 10n);
	 * ```
	 */
	public setBot(entityId: number, value: WiredVariableValueInput, options?: WiredBatchOperationOptions): this {
		return this.addRequest('PUT', `${WiredUserTargetKind.BOTS}/${entityId}`, value, options);
	}

	/**
	 * Add an update of the value already held by a bot
	 *
	 * @param entityId - The in-room ID of the bot
	 * @param value - The new value
	 * @param options - The options for the operation
	 *
	 * @example
	 * ```ts
	 * room.userVariable('score').batch().updateBot(44, 15n);
	 * ```
	 */
	public updateBot(entityId: number, value: WiredVariableValueInput, options?: WiredBatchOperationOptions): this {
		return this.addRequest('PATCH', `${WiredUserTargetKind.BOTS}/${entityId}`, value, options);
	}

	/**
	 * Add a deletion of the value held by a bot
	 *
	 * @param entityId - The in-room ID of the bot
	 * @param options - The options for the operation
	 *
	 * @example
	 * ```ts
	 * room.userVariable('score').batch().deleteBot(44);
	 * ```
	 */
	public deleteBot(entityId: number, options?: WiredBatchOperationOptions): this {
		return this.addRequest('DELETE', `${WiredUserTargetKind.BOTS}/${entityId}`, null, options);
	}
}

export class WiredFurniBatchBuilder extends WiredBatchBuilder {
	public constructor(baseURL: string, timeout: number | null | undefined, roomId: number, keys: WiredRoomKeys, variableName: string) {
		super(baseURL, timeout, roomId, keys, variableName, 'furni');
	}

	/**
	 * Add a read of the value held by a floor or wall item
	 *
	 * @param furniId - The ID of the item as seen in the client, see {@linkcode toWiredFurniTarget}
	 * @param options - The options for the operation
	 *
	 * @example
	 * ```ts
	 * room.furniVariable('open').batch().get(-91);
	 * ```
	 */
	public get(furniId: number, options?: WiredBatchOperationOptions): this {
		return this.addRequest('GET', formatFurniPath(furniId), null, options);
	}

	/**
	 * Add a write of the value for a floor or wall item, assigning it if the item does not hold it yet
	 *
	 * @param furniId - The ID of the item as seen in the client, see {@linkcode toWiredFurniTarget}
	 * @param value - The new value
	 * @param options - The options for the operation
	 *
	 * @example
	 * ```ts
	 * room.furniVariable('open').batch().set(5521, 1n);
	 * ```
	 */
	public set(furniId: number, value: WiredVariableValueInput, options?: WiredBatchOperationOptions): this {
		return this.addRequest('PUT', formatFurniPath(furniId), value, options);
	}

	/**
	 * Add an update of the value already held by a floor or wall item
	 *
	 * @param furniId - The ID of the item as seen in the client, see {@linkcode toWiredFurniTarget}
	 * @param value - The new value
	 * @param options - The options for the operation
	 *
	 * @example
	 * ```ts
	 * room.furniVariable('open').batch().update(-91, 0n);
	 * ```
	 */
	public update(furniId: number, value: WiredVariableValueInput, options?: WiredBatchOperationOptions): this {
		return this.addRequest('PATCH', formatFurniPath(furniId), value, options);
	}

	/**
	 * Add a deletion of the value held by a floor or wall item
	 *
	 * @param furniId - The ID of the item as seen in the client, see {@linkcode toWiredFurniTarget}
	 * @param options - The options for the operation
	 *
	 * @example
	 * ```ts
	 * room.furniVariable('open').batch().delete(5521);
	 * ```
	 */
	public delete(furniId: number, options?: WiredBatchOperationOptions): this {
		return this.addRequest('DELETE', formatFurniPath(furniId), null, options);
	}
}

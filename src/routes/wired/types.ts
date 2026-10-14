import type { APIOptions } from '../base.js';

/**
 * The wired API keys of a room, configured in-game. Each endpoint needs the read key, the write key, or both.
 */
export interface WiredRoomKeys {
	/**
	 * The key sent as `X-Wired-Read-Key`.
	 */
	readKey?: string | null | undefined;

	/**
	 * The key sent as `X-Wired-Write-Key`.
	 */
	writeKey?: string | null | undefined;
}

/**
 * The options for {@linkcode WiredRoomAPI.getUserVariableValues} and {@linkcode WiredRoomAPI.getFurniVariableValues}.
 */
export interface WiredListOptions extends APIOptions {
	/**
	 * The field to sort the values by.
	 */
	orderBy?: 'value' | 'creation_time' | 'update_time' | null | undefined;

	/**
	 * The direction to sort the values in.
	 */
	orderDirection?: 'asc' | 'desc' | null | undefined;

	/**
	 * The page index to look for.
	 */
	page?: number | null | undefined;

	/**
	 * The amount of entries per page.
	 */
	size?: number | null | undefined;
}

/**
 * The kinds of entities that can hold user variables.
 */
export enum WiredUserTargetKind {
	USERS = 'users',
	PETS = 'pets',
	BOTS = 'bots'
}

/**
 * The kinds of items that can hold furni variables.
 */
export enum WiredFurniTargetKind {
	FURNI = 'furni',
	FURNI_BC = 'furni-bc',
	WALL_ITEMS = 'wall-items',
	WALL_ITEMS_BC = 'wall-items-bc'
}

/**
 * An item as addressed by the wired API, see {@linkcode toWiredFurniTarget}.
 */
export interface WiredFurniTarget {
	targetKind: WiredFurniTargetKind;
	id: number;
}

/**
 * A value to write into a variable, a signed 64-bit integer. Numbers must be integers.
 */
export type WiredVariableValueInput = bigint | number;

/**
 * The value of a variable held by an entity.
 */
export interface WiredVariable {
	value: bigint;
	creation_time: `${bigint}-${bigint}-${bigint}T${string}`;
	update_time: `${bigint}-${bigint}-${bigint}T${string}`;
}

/**
 * The names of the variables configured in a room, grouped by scope.
 */
export interface WiredRoomVariables {
	users: string[];
	furni: string[];
	global: string[];
}

export interface WiredVariableCount {
	count: number;
}

/**
 * A page of values of a variable.
 */
export interface WiredVariablePage<Entity extends WiredUserEntity | WiredFurniEntity> {
	/**
	 * The entries of the page.
	 *
	 * @unstable The shape of the entries is not documented, use at your own risk
	 */
	items: ({ variable: WiredVariable } & Entity)[];
	page: number;
	size: number;
}

export interface WiredIdTarget {
	id: number;
}

export interface WiredNamedTarget extends WiredIdTarget {
	name?: string;
}

export interface WiredUserTarget extends WiredNamedTarget {
	unique_id?: string;
}

export interface WiredUserHolder {
	user: WiredUserTarget;
}

/**
 * A user, pet, or bot holding variables, keyed by its kind.
 */
export type WiredUserEntity = WiredUserHolder | { pet: WiredNamedTarget } | { bot: WiredNamedTarget };

/**
 * A floor or wall item holding variables, keyed by its kind. Use {@linkcode fromWiredFurniEntity} to get its ID as seen in the client.
 */
export type WiredFurniEntity =
	| { furni: WiredIdTarget }
	| { furni_bc: WiredIdTarget }
	| { wall_item: WiredIdTarget }
	| { wall_item_bc: WiredIdTarget };

/**
 * The variables held by an entity, or by the room for global variables.
 */
export interface WiredProfileData {
	variables: Record<string, WiredVariable>;
}

export type WiredUserProfileData = WiredProfileData & WiredUserEntity;

export type WiredFurniProfileData = WiredProfileData & WiredFurniEntity;

/**
 * The options for a single operation of a {@linkcode WiredBatchBuilder}.
 */
export interface WiredBatchOperationOptions {
	/**
	 * An ID echoed back in the operation's result.
	 */
	opId?: string | null | undefined;
}

/**
 * A batch operation in the form the API takes it, see {@linkcode WiredBatchBuilder.requests}.
 */
export interface WiredBatchRequestOperation {
	op_id?: string;
	method: 'GET' | 'PUT' | 'PATCH' | 'DELETE';

	/**
	 * The target of the operation, formatted as `<targetKind>/<entityId>`.
	 */
	path: string;
	body?: { value: string };
}

export interface WiredBatchResults {
	results: WiredBatchResult[];
}

export type WiredBatchResult = WiredBatchResultWithBody | WiredBatchResultNoContent | WiredBatchResultError;

export interface WiredBatchResultWithBody {
	op_id?: string | null;
	status: 200;
	body: WiredVariable;
}

export interface WiredBatchResultNoContent {
	op_id?: string | null;
	status: 204;
}

export interface WiredBatchResultError {
	op_id?: string | null;
	status: 400 | 403 | 404 | 429 | 500;
	error: {
		code: WiredErrorCode;
		message: string;
	};
}

/**
 * The body of a failed wired API response, found in `HttpError.jsonBody`.
 */
export interface WiredError {
	error: WiredErrorCode;
}

export enum WiredErrorCode {
	API_DISABLED = 'wired.variables.api_disabled',
	BATCH_EMPTY = 'wired.variables.batch_empty',
	BATCH_LIMIT_EXCEEDED = 'wired.variables.batch_limit_exceeded',
	BULK_DELETE_EMPTY = 'wired.variables.bulk_delete_empty',
	BULK_DELETE_INVALID_VARIABLE = 'wired.variables.bulk_delete_invalid_variable',
	BULK_DELETE_NOT_ENABLED = 'wired.variables.bulk_delete_not_enabled',
	ENTITY_NOT_FOUND = 'wired.variables.entity_not_found',
	INVALID_TARGET = 'wired.variables.invalid_target',
	INVALID_VALUE = 'wired.variables.invalid_value',
	KEY_INVALID = 'wired.variables.key_invalid',
	KEY_MISSING = 'wired.variables.key_missing',
	NOT_FOUND = 'wired.variables.not_found',
	OPERATION_NOT_ALLOWED = 'wired.variables.operation_not_allowed',
	ROOM_NOT_FOUND = 'room.not_found',
	TOO_MANY_REQUESTS = 'wired.variables.too_many_requests',
	USER_NOT_PARTICIPATING = 'wired.variables.user_not_participating'
}

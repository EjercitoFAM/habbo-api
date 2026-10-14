import { WiredRoomBase } from './base.js';
import type { WiredProfileData, WiredRoomKeys, WiredVariable } from './types.js';

/**
 * The variables held by an entity, or by the room for global variables, as they were when fetched.
 */
export abstract class WiredProfile extends WiredRoomBase {
	/**
	 * The variables by name, with their values and timestamps
	 */
	public readonly variables: Readonly<Record<string, WiredVariable>>;

	public constructor(baseURL: string, timeout: number | null | undefined, roomId: number, keys: WiredRoomKeys, data: WiredProfileData) {
		super(baseURL, timeout, roomId, keys);
		this.variables = data.variables;
	}

	/**
	 * Get the value of a variable, or `null` if it is not held
	 *
	 * @param variableName - The name of the variable
	 *
	 * @example
	 * ```ts
	 * const profile = (await room.getUserProfile(44)).unwrap();
	 * const score = profile.get('score') ?? 0n;
	 * ```
	 */
	public get(variableName: string): bigint | null {
		return this.variables[variableName]?.value ?? null;
	}
}

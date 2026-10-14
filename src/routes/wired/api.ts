import { BaseAPI } from '../base.js';
import { WiredRoomAPI } from './room.js';
import type { WiredRoomKeys } from './types.js';

export class WiredAPI extends BaseAPI {
	/**
	 * Get a client for the wired variables of a room
	 *
	 * @param roomId - The ID of the room
	 * @param keys - The room's wired API keys, configured in-game
	 *
	 * @example
	 * ```ts
	 * const room = new Habbo().wired.room(12345, { readKey: 'read-key', writeKey: 'write-key' });
	 * ```
	 */
	public room(roomId: number, keys: WiredRoomKeys): WiredRoomAPI {
		return new WiredRoomAPI(this.baseURL, this.timeout, roomId, keys);
	}
}

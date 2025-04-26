import { type FetchResult, Json } from '@skyra/safe-fetch';
import { type APIOptions, BaseAPI } from './base.js';

export class RoomsAPI extends BaseAPI {
	/**
	 * Get a room by its ID
	 *
	 * @param roomId - The ID of the room
	 * @param options - The options for the API call
	 */
	public async getById(roomId: number, options?: APIOptions): Promise<FetchResult<HabboRoom>> {
		const url = this.formatURL(`/api/public/rooms/${roomId}`);
		return Json<HabboRoom>(this.fetch(url, options));
	}
}

export interface HabboRoom {
	id: number;
	name: string;
	description: string;
	creationTime: `${bigint}-${bigint}-${bigint}T${string}`;
	habboGroupId: string;
	tags: string[];
	maximumVisitors: number;
	showOwnerName: boolean;
	ownerName: string;
	ownerUniqueId: string;
	categories: string[];
	thumbnailUrl: string;
	imageUrl: string;
	rating: number;
	uniqueId: HabboRoomUniqueId;
}

export type HabboRoomUniqueId = `r-hh${string}-${string}`;

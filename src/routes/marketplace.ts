import { Json, type FetchResult } from '@skyra/safe-fetch';
import { BaseAPI, type APIOptions } from './base.js';

export class MarketplaceAPI extends BaseAPI {
	/**
	 * Get the marketplace stats for a room item
	 *
	 * @deprecated This endpoint has been removed from the official API in favour
	 * of the newer {@linkcode MarketplaceAPI.getStats} endpoint, which can
	 * provide stats for up to 25 items per type in a single request.
	 *
	 * @param roomItemName - The name of the room item
	 * @param options - The options for the API call
	 */
	public getRoomItemStats(roomItemName: string, options?: APIOptions): Promise<FetchResult<MarketplaceStats>> {
		const url = this.formatURL(`/api/public/marketplace/stats/roomItem/${roomItemName}`);
		return Json<MarketplaceStats>(this.fetchGet(url, options));
	}

	/**
	 * Get the marketplace stats for a wall item
	 *
	 * @deprecated This endpoint has been removed from the official API in favour
	 * of the newer {@linkcode MarketplaceAPI.getStats} endpoint, which can
	 * provide stats for up to 25 items per type in a single request.
	 *
	 * @param wallItemName - The name of the wall item
	 * @param options - The options for the API call
	 */
	public getWallItemStats(wallItemName: string, options?: APIOptions): Promise<FetchResult<MarketplaceStats>> {
		const url = this.formatURL(`/api/public/marketplace/stats/wallItem/${wallItemName}`);
		return Json<MarketplaceStats>(this.fetchGet(url, options));
	}

	/**
	 * Get the marketplace stats for up to 25 room and wall items at once
	 *
	 * @param data - The data for the stats request
	 * @param options - The options for the API call
	 */
	public getStats(data: MarketplaceGetStats, options?: APIOptions) {
		const url = this.formatURL('/api/public/marketplace/stats');
		return Json<MarketplaceStats[]>(this.fetchPost(url, data, options));
	}
}

export interface MarketplaceStats {
	history: MarketplaceStatsHistory[];
	statsDate: `${bigint}-${bigint}-${bigint}`;
	soldItemCount: number;
	creditSum: number;
	averagePrice: number;
	totalOpenOffers: number;
	historyLimitInDays: number;
}

export interface MarketplaceStatsHistory {
	dayOffset: `${bigint}`;
	averagePrice: `${bigint}`;
	totalSoldItems: `${bigint}`;
	totalCreditSum: `${bigint}`;
	totalOpenOffers: `${bigint}`;
}

export interface MarketplaceGetStats {
	roomItems: string[];
	wallItems: string[];
}

export interface MarketplaceStatsResult {
	status: string;
	roomItemData: MarketplaceStatsResultEntry[];
	wallItemData: MarketplaceStatsResultEntry[];
}

export interface MarketplaceStatsResultEntry {
	item: string;
	extraData: null;
	statsDate: Date;
	history: MarketplaceStatsResultEntryHistory[];
	soldItemCount: number;
	creditSum: number;
	averagePrice: number;
	totalOpenOffers: number;
	currentOpenOffers: number;
	currentPrice: number;
	historyLimitInDays: number;
}

export interface MarketplaceStatsResultEntryHistory {
	dayOffset: string;
	averagePrice: string;
	totalSoldItems: string;
	totalCreditSum: string;
	totalOpenOffers: string;
}

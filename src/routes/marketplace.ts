import { Json, type FetchResult } from '@skyra/safe-fetch';
import { BaseAPI, type APIOptions } from './base.js';

export class MarketplaceAPI extends BaseAPI {
	/**
	 * Get the marketplace stats for a room item
	 *
	 * @param roomItemName - The name of the room item
	 * @param options - The options for the API call
	 */
	public getRoomItemStats(roomItemName: string, options?: APIOptions): Promise<FetchResult<MarketplaceStats>> {
		const url = this.formatURL(`/api/public/marketplace/stats/roomItem/${roomItemName}`);
		return Json<MarketplaceStats>(this.fetch(url, options));
	}

	/**
	 * Get the marketplace stats for a wall item
	 *
	 * @param wallItemName - The name of the wall item
	 * @param options - The options for the API call
	 */
	public getWallItemStats(wallItemName: string, options?: APIOptions): Promise<FetchResult<MarketplaceStats>> {
		const url = this.formatURL(`/api/public/marketplace/stats/wallItem/${wallItemName}`);
		return Json<MarketplaceStats>(this.fetch(url, options));
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

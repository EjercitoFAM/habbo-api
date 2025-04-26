import { type FetchResult } from '@skyra/safe-fetch';
import { BaseAPI, type APIOptions } from './base.js';

export class ListsAPI extends BaseAPI {
	/**
	 * Get the hot looks from the hotel
	 *
	 * @param options - The options for the API call
	 */
	public async getHotLooks(options: APIOptions): Promise<FetchResult<HabboHotLookList>> {
		const url = this.formatURL('/api/public/lists/hotlooks');
		const data = await this.fetch(url, options);
		return data.map(async (result) => this.#parseHotLooksXML(await result.text())).intoPromise();
	}

	#parseHotLooksXML(data: string): HabboHotLookList {
		const urlResult = /url="(.*)"/.exec(data);
		if (urlResult === null) throw new SyntaxError('Could not read hot looks');

		const url = urlResult[1];
		const entries = [] as HabboHotLookListItem[];
		for (const result of data.matchAll(/gender="(\w)" figure="(.+)" hash="(.+)"/g)) {
			entries.push({ gender: result[1] as 'f' | 'm', figure: result[2], hash: result[3] });
		}

		if (entries.length === 0) throw new SyntaxError('Could not read hot looks');

		return { url, entries };
	}
}

export interface HabboHotLookList {
	url: string;
	entries: HabboHotLookListItem[];
}

export interface HabboHotLookListItem {
	gender: 'f' | 'm';
	figure: string;
	hash: string;
}

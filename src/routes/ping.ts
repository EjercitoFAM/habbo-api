import { type APIOptions, BaseAPI } from './base.js';

export class PingAPI extends BaseAPI {
	/**
	 * Pings Habbo, returning the measured time using {@linkcode performance.now()}
	 *
	 * @param options - The options for the API call
	 */
	public async get(options?: APIOptions): Promise<number | null> {
		const url = this.formatURL('/api/public/ping');
		const now = performance.now();
		return (await this.fetch(url, options)).match({
			ok: () => performance.now() - now,
			err: () => null
		});
	}
}

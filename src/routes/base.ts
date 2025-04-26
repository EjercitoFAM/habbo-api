import { safeFetch, type FetchResult } from '@skyra/safe-fetch';

export abstract class BaseAPI {
	protected readonly baseURL: string;
	protected readonly timeout: number | null;

	public constructor(baseURL: string, timeout?: number | null | undefined) {
		this.baseURL = baseURL;
		this.timeout = timeout ?? null;
	}

	protected formatURL(route: string): URL {
		return new URL(route, this.baseURL);
	}

	protected fetch(url: string | URL, options?: APIOptions): Promise<FetchResult<Response>> {
		return safeFetch(url, { headers: { 'Content-Type': 'application/json' }, signal: this.#getSignalOrDefault(options) });
	}

	#getSignalOrDefault(options?: APIOptions): AbortSignal | null {
		if (typeof options === 'object' && options !== null) {
			if (typeof options.signal === 'number') return AbortSignal.timeout(options.signal);
			if (typeof options.signal === 'object' && options.signal !== null) return options.signal;
		}

		if (typeof this.timeout === 'number') return AbortSignal.timeout(this.timeout);
		return null;
	}
}

export interface APIOptions {
	signal?: AbortSignal | number | null | undefined;
}

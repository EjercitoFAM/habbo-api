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

	protected fetchGet(url: string | URL, options?: APIOptions, headers?: Record<string, string>): Promise<FetchResult<Response>> {
		return safeFetch(url, { headers: { 'Content-Type': 'application/json', ...headers }, signal: this.#getSignalOrDefault(options) });
	}

	protected fetchPost(url: string | URL, body: object, options?: APIOptions, headers?: Record<string, string>): Promise<FetchResult<Response>> {
		return this.#fetchWithBody('POST', url, body, options, headers);
	}

	protected fetchPut(url: string | URL, body: object, options?: APIOptions, headers?: Record<string, string>): Promise<FetchResult<Response>> {
		return this.#fetchWithBody('PUT', url, body, options, headers);
	}

	protected fetchPatch(url: string | URL, body: object, options?: APIOptions, headers?: Record<string, string>): Promise<FetchResult<Response>> {
		return this.#fetchWithBody('PATCH', url, body, options, headers);
	}

	protected fetchDelete(url: string | URL, options?: APIOptions, headers?: Record<string, string>): Promise<FetchResult<Response>> {
		return safeFetch(url, { method: 'DELETE', headers, signal: this.#getSignalOrDefault(options) });
	}

	#fetchWithBody(
		method: 'POST' | 'PUT' | 'PATCH',
		url: string | URL,
		body: object,
		options?: APIOptions,
		headers?: Record<string, string>
	): Promise<FetchResult<Response>> {
		return safeFetch(url, {
			method,
			headers: { 'Content-Type': 'application/json', ...headers },
			body: JSON.stringify(body),
			signal: this.#getSignalOrDefault(options)
		});
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

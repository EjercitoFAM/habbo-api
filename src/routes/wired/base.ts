import { isNullish } from '../../common.js';
import { BaseAPI } from '../base.js';
import type { WiredListOptions, WiredRoomKeys } from './types.js';

export abstract class WiredRoomBase extends BaseAPI {
	public readonly roomId: number;
	readonly #keys: WiredRoomKeys;

	public constructor(baseURL: string, timeout: number | null | undefined, roomId: number, keys: WiredRoomKeys) {
		super(baseURL, timeout);
		this.roomId = roomId;
		this.#keys = keys;
	}

	protected get keys(): WiredRoomKeys {
		return this.#keys;
	}

	protected formatRoomURL(route: string): URL {
		return this.formatURL(`/api/public/rooms/${this.roomId}/${route}`);
	}

	protected formatListURL(route: string, options?: WiredListOptions): URL {
		const url = this.formatRoomURL(route);
		if (!isNullish(options?.orderBy)) url.searchParams.set('order_by', options.orderBy);
		if (!isNullish(options?.orderDirection)) url.searchParams.set('order_dir', options.orderDirection);
		if (!isNullish(options?.page)) url.searchParams.set('page', options.page.toString());
		if (!isNullish(options?.size)) url.searchParams.set('size', options.size.toString());
		return url;
	}

	protected readHeaders(): Record<string, string> {
		return isNullish(this.#keys.readKey) ? {} : { 'X-Wired-Read-Key': this.#keys.readKey };
	}

	protected writeHeaders(): Record<string, string> {
		return isNullish(this.#keys.writeKey) ? {} : { 'X-Wired-Write-Key': this.#keys.writeKey };
	}
}

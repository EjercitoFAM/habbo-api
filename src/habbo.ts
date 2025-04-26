import { HotelDomainURL } from './constants.js';
import { AchievementsAPI } from './routes/achievements.js';
import { GroupsAPI } from './routes/groups.js';
import { ListsAPI } from './routes/lists.js';
import { MarketplaceAPI } from './routes/marketplace.js';
import { PingAPI } from './routes/ping.js';
import { RoomsAPI } from './routes/rooms.js';
import { UsersAPI } from './routes/users.js';

export class Habbo {
	public readonly achievements: AchievementsAPI;
	public readonly groups: GroupsAPI;
	public readonly lists: ListsAPI;
	public readonly marketplace: MarketplaceAPI;
	public readonly ping: PingAPI;
	public readonly rooms: RoomsAPI;
	public readonly users: UsersAPI;

	public constructor(options?: HabboOptions) {
		const baseURL = options?.baseURL ?? HotelDomainURL.International;
		const timeout = options?.timeout ?? null;

		this.achievements = new AchievementsAPI(baseURL, timeout);
		this.groups = new GroupsAPI(baseURL, timeout);
		this.lists = new ListsAPI(baseURL, timeout);
		this.marketplace = new MarketplaceAPI(baseURL, timeout);
		this.ping = new PingAPI(baseURL, timeout);
		this.rooms = new RoomsAPI(baseURL, timeout);
		this.users = new UsersAPI(baseURL, timeout);
	}
}

export interface HabboOptions {
	baseURL?: string | null | undefined;
	timeout?: number | null | undefined;
}

import { Json, type FetchResult } from '@skyra/safe-fetch';
import { HabboGroupType } from './groups.js';
import { BaseAPI, type APIOptions } from './base.js';

export class UsersAPI extends BaseAPI {
	/**
	 * Get a user by its username
	 *
	 * @param username - The username to search a Habbo user by
	 * @param options - The options for the API call
	 */
	public getByUsername(username: string, options?: APIOptions): Promise<FetchResult<HabboUser>> {
		const url = this.formatURL('/api/public/users');
		url.searchParams.set('name', username);
		return Json<HabboUser>(this.fetch(url, options));
	}

	/**
	 * Get a user by its ID
	 *
	 * @param uniqueId - The ID to search a Habbo user by
	 * @param options - The options for the API call
	 */
	public getByUniqueId(uniqueId: string, options?: APIOptions): Promise<FetchResult<HabboUser>> {
		const url = this.formatURL(`/api/public/users/${uniqueId}`);
		return Json<HabboUser>(this.fetch(url, options));
	}

	/**
	 * Get a user's friends
	 *
	 * @param uniqueId - The ID to search a Habbo user by
	 * @param options - The options for the API call
	 */
	public getUserFriends(uniqueId: string, options?: APIOptions): Promise<FetchResult<HabboUserFriend[]>> {
		const url = this.formatURL(`/api/public/users/${uniqueId}/friends`);
		return Json<HabboUserFriend[]>(this.fetch(url, options));
	}

	/**
	 * Get a user's groups
	 *
	 * @param uniqueId - The ID to search a Habbo user by
	 * @param options - The options for the API call
	 */
	public getUserGroups(uniqueId: string, options?: APIOptions): Promise<FetchResult<HabboUserGroup[]>> {
		const url = this.formatURL(`/api/public/users/${uniqueId}/groups`);
		return Json<HabboUserGroup[]>(this.fetch(url, options));
	}

	/**
	 * Get a user's rooms
	 *
	 * @param uniqueId - The ID to search a Habbo user by
	 * @param options - The options for the API call
	 */
	public getUserRooms(uniqueId: string, options?: APIOptions): Promise<FetchResult<HabboUserRoom[]>> {
		const url = this.formatURL(`/api/public/users/${uniqueId}/rooms`);
		return Json<HabboUserRoom[]>(this.fetch(url, options));
	}

	/**
	 * Get a user's badges
	 *
	 * @param uniqueId - The ID to search a Habbo user by
	 * @param options - The options for the API call
	 */
	public getUserBadges(uniqueId: string, options?: APIOptions): Promise<FetchResult<HabboUserBadge[]>> {
		const url = this.formatURL(`/api/public/users/${uniqueId}/badges`);
		return Json<HabboUserBadge[]>(this.fetch(url, options));
	}

	/**
	 * Get a user's profile
	 *
	 * @param uniqueId - The ID to search a Habbo user by
	 * @param options - The options for the API call
	 */
	public getUserProfile(uniqueId: string, options?: APIOptions): Promise<FetchResult<HabboUserProfile>> {
		const url = this.formatURL(`/api/public/users/${uniqueId}/profile`);
		return Json<HabboUserProfile>(this.fetch(url, options));
	}

	/**
	 * Get a user's photos
	 *
	 * @param uniqueId - The ID to search a Habbo user by
	 * @param options - The options for the API call
	 */
	public getUserPhotos(uniqueId: string, options?: APIOptions): Promise<FetchResult<HabboUserPhotos[]>> {
		const url = this.formatURL(`/extradata/public/users/${uniqueId}/photos`);
		return Json<HabboUserPhotos[]>(this.fetch(url, options));
	}
}

export type HabboUserId = `hh${string}-${string}`;

/**
 * Represents a Habbo user.
 */
export interface HabboUser {
	/**
	 * The unique identifier of the user.
	 */
	uniqueId: HabboUserId;
	/**
	 * The name of the user.
	 */
	name: string;
	/**
	 * The figure string of the user.
	 */
	figureString: string;
	/**
	 * The motto of the user.
	 */
	motto: string;
	/**
	 * Indicates whether the user is online.
	 */
	online: boolean;
	/**
	 * The last access time of the user.
	 */
	lastAccessTime: string;
	/**
	 * The date when the user became a member.
	 */
	memberSince: string;
	/**
	 * Indicates whether the user's profile is visible.
	 */
	profileVisible: boolean;
	/**
	 * The current level of the user.
	 */
	currentLevel: number;
	/**
	 * The percentage of the current level completed by the user.
	 */
	currentLevelCompletePercent: number;
	/**
	 * The total experience points of the user.
	 */
	totalExperience: number;
	/**
	 * The number of star gems the user has.
	 */
	starGemCount: number;
	/**
	 * The badges selected by the user.
	 */
	selectedBadges: HabboUserSelectedBadge[];
}

/**
 * Represents a room owned by a Habbo user.
 */
export interface HabboUserRoom {
	/**
	 * The unique identifier of the room.
	 */
	id: number;
	/**
	 * The name of the room.
	 */
	name: string;
	/**
	 * The description of the room.
	 */
	description: string;
	/**
	 * The creation time of the room.
	 */
	creationTime: string;
	/**
	 * The unique identifier of the Habbo group associated with the room.
	 */
	habboGroupId: string;
	/**
	 * The tags associated with the room.
	 */
	tags: string[];
	/**
	 * The maximum number of visitors allowed in the room.
	 */
	maximumVisitors: number;
	/**
	 * Indicates whether the owner's name is shown.
	 */
	showOwnerName: boolean;
	/**
	 * The name of the room owner.
	 */
	ownerName: string;
	/**
	 * The unique identifier of the room owner.
	 */
	ownerUniqueId: string;
	/**
	 * The categories associated with the room.
	 */
	categories: string[];
	/**
	 * The URL of the room's thumbnail image.
	 */
	thumbnailUrl: string;
	/**
	 * The URL of the room's image.
	 */
	imageUrl: string;
	/**
	 * The rating of the room.
	 */
	rating: number;
	/**
	 * The unique identifier of the room.
	 */
	uniqueId: string;
}

/**
 * Represents a group associated with a Habbo user.
 */
export interface HabboUserGroup {
	/**
	 * Indicates whether the group is online.
	 */
	online: boolean;
	/**
	 * The unique identifier of the group.
	 */
	id: string;
	/**
	 * The name of the group.
	 */
	name: string;
	/**
	 * The description of the group.
	 */
	description: string;
	/**
	 * The type of the group.
	 */
	type: HabboGroupType;
	/**
	 * The unique identifier of the room associated with the group.
	 */
	roomId: string;
	/**
	 * The badge code of the group.
	 */
	badgeCode: string;
	/**
	 * The primary color of the group.
	 */
	primaryColour: string;
	/**
	 * The secondary color of the group.
	 */
	secondaryColour: string;
	/**
	 * Indicates whether the user is an admin of the group.
	 */
	isAdmin: boolean;
}

/**
 * Represents a badge owned by a Habbo user.
 */
export interface HabboUserBadge {
	/**
	 * The code of the badge.
	 */
	code: string;
	/**
	 * The name of the badge.
	 */
	name: string;
	/**
	 * The description of the badge.
	 */
	description: string;
}

/**
 * Represents a selected badge of a Habbo user.
 */
export interface HabboUserSelectedBadge extends HabboUserBadge {
	/**
	 * The index of the badge.
	 */
	badgeIndex: number;
}

/**
 * Represents a friend of a Habbo user.
 */
export interface HabboUserFriend {
	/**
	 * The unique identifier of the friend.
	 */
	uniqueId: string;
	/**
	 * The name of the friend.
	 */
	name: string;
	/**
	 * The figure string of the friend.
	 */
	figureString: string;
	/**
	 * The motto of the friend.
	 */
	motto: string;
	/**
	 * Indicates whether the friend is online.
	 */
	online: boolean;
}

/**
 * Represents the profile of a Habbo user.
 */
export interface HabboUserProfile {
	/**
	 * The unique identifier of the user.
	 */
	uniqueId: string;
	/**
	 * The name of the user.
	 */
	name: string;
	/**
	 * The figure string of the user.
	 */
	figureString: string;
	/**
	 * The motto of the user.
	 */
	motto: string;
	/**
	 * Indicates whether the user is online.
	 */
	online: boolean;
	/**
	 * The last access time of the user.
	 */
	lastAccessTime: string;
	/**
	 * The date when the user became a member.
	 */
	memberSince: string;
	/**
	 * Indicates whether the user's profile is visible.
	 */
	profileVisible: boolean;
	/**
	 * The current level of the user.
	 */
	currentLevel: number;
	/**
	 * The percentage of the current level completed by the user.
	 */
	currentLevelCompletePercent: number;
	/**
	 * The total experience points of the user.
	 */
	totalExperience: number;
	/**
	 * The number of star gems the user has.
	 */
	starGemCount: number;
	/**
	 * The badges selected by the user.
	 */
	selectedBadges: HabboUserSelectedBadge[];
	/**
	 * The groups the user is a member of.
	 */
	groups: HabboUserGroup[];
	/**
	 * The badges owned by the user.
	 */
	badges: HabboUserBadge[];
	/**
	 * The friends of the user.
	 */
	friends: HabboUserFriend[];
	/**
	 * The rooms owned by the user.
	 */
	rooms: HabboUserRoom[];
}

/**
 * Represents photos associated with a Habbo user.
 */
export interface HabboUserPhotos {
	/**
	 * The unique identifier of the room where the photo was taken.
	 */
	room_id: number;
	/**
	 * The unique identifier of the photo creator.
	 */
	creator_id: number;
	/**
	 * The name of the photo creator.
	 */
	creator_name: string;
	/**
	 * The time when the photo was taken.
	 */
	time: number;
	/**
	 * The version of the photo.
	 */
	version: number;
	/**
	 * The URL of the photo.
	 */
	url: string;
	/**
	 * The type of the photo.
	 */
	type: string;
	/**
	 * The unique identifier of the photo creator.
	 */
	creator_uniqueId: string;
	/**
	 * The tags associated with the photo.
	 */
	tags: string[];
	/**
	 * The URL of the photo preview.
	 */
	previewUrl: string;
	/**
	 * The unique identifier of the photo.
	 */
	id: string;
	/**
	 * The likes associated with the photo.
	 */
	likes: string[];
}

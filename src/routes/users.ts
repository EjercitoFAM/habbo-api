import { Json, type FetchResult } from '@skyra/safe-fetch';
import { isNullish } from '../common.js';
import { BaseAPI, type APIOptions } from './base.js';
import { HabboGroupType } from './groups.js';

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

	/**
	 * Get a user's figure
	 *
	 * @param options - The options for the image
	 */
	public getUserFigureImageURL(options: HabboFigureName | HabboFigureStatic): URL {
		const url = this.formatURL('/habbo-imaging/avatarimage');

		if ('figure' in options && !isNullish(options.figure)) {
			url.searchParams.append('figure', options.figure);
			if (!isNullish(options.gender)) url.searchParams.append('gender', HabboFigureGender[options.gender]);
		} else if ('user' in options && !isNullish(options.user)) {
			url.searchParams.append('user', options.user);
		} else {
			throw new Error('You must define `figure` or `user` in the options');
		}

		if (!isNullish(options.action)) {
			const habboAction = HabboFigureAction[options.action];
			url.searchParams.append(
				'action',
				isNullish(options.hand) //
					? habboAction
					: `${habboAction}=${HabboFigureHand[options.hand]}`
			);
		}
		if (!isNullish(options.direction)) url.searchParams.append('direction', HabboFigureDirection[options.direction]);
		if (!isNullish(options.headDirection)) url.searchParams.append('head_direction', HabboFigureDirection[options.headDirection]);
		if (!isNullish(options.gesture)) url.searchParams.append('gesture', HabboFigureGesture[options.gesture]);
		if (!isNullish(options.size)) url.searchParams.append('size', HabboFigureSize[options.size]);
		if (!isNullish(options.headOnly)) url.searchParams.append('headonly', options.headOnly ? '1' : '0');

		return url;
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

export interface HabboFigureName extends HabboFigureBase {
	/**
	 * The Habbo username.
	 */
	user: string;
}

export interface HabboFigureStatic extends HabboFigureBase {
	/**
	 * The Habbo figure to use.
	 */
	figure: string;
	/**
	 * The Habbo's gender.
	 */
	gender?: keyof typeof HabboFigureGender | undefined | null;
}

export interface HabboFigureBase {
	/**
	 * The action the user should perform.
	 */
	action?: keyof typeof HabboFigureAction | undefined | null;
	/**
	 * The hand item, will override {@linkcode HabboFigureBase.action} to `'crr'`.
	 */
	hand?: keyof typeof HabboFigureHand | undefined | null;
	/**
	 * The Habbo's direction.
	 */
	direction?: keyof typeof HabboFigureDirection | undefined | null;
	/**
	 * The Habbo's head direction.
	 */
	headDirection?: keyof typeof HabboFigureDirection | undefined | null;
	/**
	 * The gesture, if any.
	 */
	gesture?: keyof typeof HabboFigureGesture | undefined | null;
	/**
	 * The size of the character.
	 */
	size?: keyof typeof HabboFigureSize | undefined | null;
	/**
	 * Whether or not to render only the head.
	 */
	headOnly?: boolean | undefined | null;
}

export const HabboFigureAction = {
	// Main Actions
	lay: 'lay',
	sit: 'sit',
	respect: 'respect',
	walk: 'wlk',
	wave: 'wav',
	carry: 'crr',
	drink: 'drk',
	sign: 'sig',
	blow: 'blw',
	laugh: 'laugh'
} as const;

export const HabboFigureHand = {
	nothing: '0',
	carrot: '2',
	coffee: '6',
	cocktail: '667',
	habbo_cola: '5',
	ice_cream: '3',
	japanese_tea: '42',
	love_potion: '9',
	radioactive: '44',
	tomato: '43',
	water: '1'
} as const;

export const HabboFigureGesture = {
	nothing: 'nrm',
	happy: 'sml',
	sad: 'sad',
	angry: 'agr',
	surprised: 'srp',
	sleeping: 'eyb',
	speaking: 'spk'
} as const;

export const HabboFigureSize = { small: 's', normal: 'm', large: 'l' } as const;
export const HabboFigureDirection = { nw: '0', w: '1', sw: '2', s: '3', se: '4', e: '5', ne: '6', n: '7' } as const;
export const HabboFigureGender = { male: 'M', female: 'F' } as const;

export const HabboFigureGestureKeys = Object.keys(HabboFigureGesture) as (keyof typeof HabboFigureGesture)[];
export const HabboFigureActionKeys = Object.keys(HabboFigureAction) as (keyof typeof HabboFigureAction)[];
export const HabboFigureHandKeys = Object.keys(HabboFigureHand) as (keyof typeof HabboFigureHand)[];
export const HabboFigureSizeKeys = Object.keys(HabboFigureSize) as (keyof typeof HabboFigureSize)[];
export const HabboFigureDirectionKeys = Object.keys(HabboFigureDirection) as (keyof typeof HabboFigureDirection)[];
export const HabboFigureGenderKeys = Object.keys(HabboFigureGender) as (keyof typeof HabboFigureGender)[];

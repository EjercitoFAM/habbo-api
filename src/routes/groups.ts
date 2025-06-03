import { Json, type FetchResult } from '@skyra/safe-fetch';
import { isNullish } from '../common.js';
import { BaseAPI, type APIOptions } from './base.js';
import type { HabboRoomUniqueId } from './rooms.js';

export class GroupsAPI extends BaseAPI {
	/**
	 * Get the data for a group given its identifier
	 *
	 * @param id - The ID of the group
	 * @param options - The options for the API call
	 */
	public getByUniqueId(id: HabboGroupId, options?: APIOptions): Promise<FetchResult<HabboGroup>> {
		const url = this.formatURL(`/api/public/groups/${id}`);
		return Json<HabboGroup>(this.fetch(url, options));
	}

	/**
	 * Get the members from a group given its identifier
	 *
	 * @param id - The ID of the group
	 * @param options - The options for the API call
	 */
	public getGroupMembers(id: HabboGroupId, options?: GetGroupMembersOptions): Promise<FetchResult<HabboGroupMember[]>> {
		const url = this.formatURL(`/api/public/groups/${id}/members`);
		if (!isNullish(options?.pageIndex)) {
			url.searchParams.append('pageIndex', options.pageIndex.toString());
		}

		return Json<HabboGroupMember[]>(this.fetch(url, options));
	}

	/**
	 * Get the image URL for a badge
	 *
	 * @param badgeCode - The badge's code, retrieved from {@linkcode HabboGroup.badgeCode}
	 *
	 * @unstable This feature is not documented, use at your own risk
	 */
	public getGroupBadgeImageURL(badgeCode: string): URL {
		return this.formatURL(`/habbo-imaging/badge/${badgeCode}`);
	}
}

/**
 * The options for {@linkcode GroupsAPI.getGroupMembers}.
 */
export interface GetGroupMembersOptions extends APIOptions {
	/**
	 * The page index to look for, each page containing up to 1000 entries.
	 */
	pageIndex?: number | null | undefined;
}

export type HabboGroupId = `g-hh${string}-${string};`;

/**
 * Represents a Habbo group.
 */
export interface HabboGroup {
	/**
	 * The unique identifier of the group.
	 */
	id: HabboGroupId;

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
	 * The ID of the room associated with the group, or null if no room is associated.
	 */
	roomId: HabboRoomUniqueId;

	/**
	 * The badge code of the group.
	 */
	badgeCode: string;
}

/**
 * Enum representing the type of a Habbo group.
 */
export enum HabboGroupType {
	/**
	 * A normal group (public).
	 */
	NORMAL = 'NORMAL',

	/**
	 * A favourite (exclusive) group.
	 */
	FAVOURITE = 'EXCLUSIVE',

	/**
	 * A private (closed) group.
	 */
	PRIVATE = 'CLOSED'
}

/**
 * Represents a member of a Habbo group.
 */
export interface HabboGroupMember {
	/**
	 * Indicates whether the member is online.
	 */
	online: boolean;

	/**
	 * The gender of the member.
	 */
	gender: 'm' | 'f';

	/**
	 * The motto of the member.
	 */
	motto: string;

	/**
	 * The figure of the member in the Habbo world.
	 */
	habboFigure: string;

	/**
	 * The date since the member joined the group.
	 */
	memberSince: string;

	/**
	 * The unique identifier of the member.
	 */
	uniqueId: string;

	/**
	 * The name of the member.
	 */
	name: string;

	/**
	 * Indicates whether the member is an admin of the group.
	 */
	isAdmin: boolean;
}

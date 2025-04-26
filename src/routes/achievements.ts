import { Json, type FetchResult } from '@skyra/safe-fetch';
import { BaseAPI, type APIOptions } from './base.js';
import type { HabboUserId } from './users.js';

export class AchievementsAPI extends BaseAPI {
	/**
	 * Get all achievements
	 *
	 * @param options - The options for the API call
	 */
	public getAll(options?: APIOptions): Promise<FetchResult<Achievement[]>> {
		const url = this.formatURL('/api/public/achievements');
		return Json<Achievement[]>(this.fetch(url, options));
	}

	/**
	 * Get the achievements from a specified user ID
	 *
	 * @param id - The ID of the user
	 * @param options - The options for the API call
	 */
	public getByUserId(id: HabboUserId, options?: APIOptions): Promise<FetchResult<UserAchievement[]>> {
		const url = this.formatURL(`/api/public/achievements/${id}`);
		return Json<UserAchievement[]>(this.fetch(url, options));
	}

	/**
	 * Get the image URL for an achievement
	 *
	 * @param achievementName - The name of the achievement, retrieved from {@linkcode AchievementData.name}
	 *
	 * @unstable This feature is not documented, use at your own risk
	 */
	public getImageURL(achievementName: string): URL {
		return new URL(`https://images.habbo.com/c_images/album1584/${achievementName}.png`);
	}
}

export interface Achievement {
	achievement: AchievementData;
	levelRequirements: AchievementRequirements;
}

export interface UserAchievement {
	achievement: AchievementData;
	level: number;
	score: number;
}

export interface AchievementData {
	id: number;
	name: string;
	creationTime: `${bigint}-${bigint}-${bigint}`;
	state: AchievementDataState;
	category: string;
}

export enum AchievementDataState {
	Enabled = 'ENABLED',
	Archived = 'ARCHIVED',
	OffSeason = 'OFF_SEASON'
}

export interface AchievementRequirements {
	level: number;
	requiredScore: number;
}

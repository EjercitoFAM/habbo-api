import { WiredFurniTargetKind, type WiredFurniEntity, type WiredFurniTarget } from './types.js';

/**
 * The offset the client adds to the IDs of Builders Club items.
 */
export const WiredBuildersClubFurniIdOffset = 2147418112;

/**
 * Convert an item ID as seen in the client into the target kind and ID the wired API expects.
 *
 * The client reports wall items with negative IDs and Builders Club items offset by
 * {@linkcode WiredBuildersClubFurniIdOffset}, while the API only accepts positive IDs under
 * a target kind telling them apart.
 *
 * @param furniId - The ID of the item as seen in the client
 *
 * @example
 * ```ts
 * toWiredFurniTarget(5521); // { targetKind: 'furni', id: 5521 }
 * toWiredFurniTarget(-91); // { targetKind: 'wall-items', id: 91 }
 * toWiredFurniTarget(2147418117); // { targetKind: 'furni-bc', id: 5 }
 * ```
 */
export function toWiredFurniTarget(furniId: number): WiredFurniTarget {
	const wall = furniId < 0;
	const id = Math.abs(furniId);
	if (id >= WiredBuildersClubFurniIdOffset) {
		return {
			targetKind: wall ? WiredFurniTargetKind.WALL_ITEMS_BC : WiredFurniTargetKind.FURNI_BC,
			id: id - WiredBuildersClubFurniIdOffset
		};
	}

	return { targetKind: wall ? WiredFurniTargetKind.WALL_ITEMS : WiredFurniTargetKind.FURNI, id };
}

/**
 * Convert an item returned by the wired API back into its ID as seen in the client, the inverse of
 * {@linkcode toWiredFurniTarget}.
 *
 * @param entity - The item, as found in {@linkcode WiredFurniProfile} and {@linkcode WiredVariablePage} entries
 *
 * @example
 * ```ts
 * fromWiredFurniEntity({ wall_item: { id: 91 } }); // -91
 * fromWiredFurniEntity({ furni_bc: { id: 5 } }); // 2147418117
 * ```
 */
export function fromWiredFurniEntity(entity: WiredFurniEntity): number {
	if ('furni' in entity) return entity.furni.id;
	if ('furni_bc' in entity) return entity.furni_bc.id + WiredBuildersClubFurniIdOffset;
	if ('wall_item' in entity) return -entity.wall_item.id;
	return -(entity.wall_item_bc.id + WiredBuildersClubFurniIdOffset);
}

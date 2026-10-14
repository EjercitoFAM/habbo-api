import { Text, type FetchResult } from '@skyra/safe-fetch';
import { toWiredFurniTarget } from './furni-id.js';
import type { WiredVariableValueInput } from './types.js';

export function formatFurniPath(furniId: number): string {
	const target = toWiredFurniTarget(furniId);
	return `${target.targetKind}/${target.id}`;
}

export function formatVariables(variables: Readonly<Record<string, WiredVariableValueInput | null>>): Record<string, string | null> {
	return Object.fromEntries(Object.entries(variables).map(([name, value]) => [name, value === null ? null : String(value)]));
}

export async function parseWiredJson<T extends object>(result: Promise<FetchResult<Response>>): Promise<FetchResult<T>> {
	return (await Text(result)).map((text) => JSON.parse(text, reviveWiredValue) as T);
}

// Values are int64 sent as strings, `JSON.parse` would lose precision past 2^53 if they were numbers
function reviveWiredValue(key: string, value: unknown): unknown {
	return key === 'value' && typeof value === 'string' && /^-?\d+$/.test(value) ? BigInt(value) : value;
}

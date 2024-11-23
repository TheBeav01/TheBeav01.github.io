import {state} from "svelte"
declare module 'sv'
declare global {
	namespace $state {
		type MyPrimitive = string | number | boolean | null | undefined | Promise;

		type MySnapshot<T> = T extends MyPrimitive
			? T
			: T extends Cloneable
				? NonReactive<T>
				: T extends { toJSON(): infer R }
					? R
					: T extends Array<infer U>
						? Array<Snapshot<U>>
						: T extends object
							? T extends { [key: string]: unknown }
								? { [K in keyof T]: Snapshot<T[K]> }
								: never
							: never;

		export function snapshot<T>(state: T): MySnapshot<T>;
	}
}
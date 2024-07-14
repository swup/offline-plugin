/**
 * Check if the user's device is online
 */
export function networkIsOnline(): boolean {
	return navigator.onLine ?? true;
}

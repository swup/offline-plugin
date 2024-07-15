import Plugin from '@swup/plugin';
import { Location, getCurrentUrl } from 'swup';
import type { PageData, HookDefaultHandler } from 'swup';
import { networkIsOnline } from './util.js';

declare module 'swup' {
	export interface Swup {
		/**
		 * The current network online status.
		 */
		online?: boolean;
	}
	export interface HookDefinitions {
		'network:online': undefined;
		'network:offline': undefined;
	}
}

export type PluginOptions = {
	offlinePage: string;
};

export default class SwupOfflinePlugin extends Plugin {
	name = 'SwupOfflinePlugin';

	requires = { swup: '>=4.0' };

	defaults: PluginOptions = {
		offlinePage: '/offline'
	};

	options: PluginOptions;

	constructor(options: Partial<PluginOptions> = {}) {
		super();

		this.options = { ...this.defaults, ...options };
	}

	mount() {
		const swup = this.swup;

		swup.hooks.create('network:online');
		swup.hooks.create('network:offline');

		// Add online/offline getter to swup instance
		Object.defineProperty(swup, 'online', { get: () => networkIsOnline() });

		// Listen for network status changes
		this.handleNetworkStatusChange = this.handleNetworkStatusChange.bind(this);
		window.addEventListener('online', this.handleNetworkStatusChange);
		window.addEventListener('offline', this.handleNetworkStatusChange);

		// Inject offline content whenever a page is requested
		this.replace('page:load', this.onPageLoad);

		// Preload offline page
		this.preloadOfflinePage();
	}

	unmount() {
		// Remove online/offline getter from swup instance
		// delete this.swup.online;

		// Remove network status change listener
		window.removeEventListener('online', this.handleNetworkStatusChange);
		window.removeEventListener('offline', this.handleNetworkStatusChange);
	}

	/**
	 * Trigger hooks when the network status changes.
	 */
	protected handleNetworkStatusChange = () => {
		// @ts-expect-error - method is marked private
		const visit = this.swup.createVisit({ to: getCurrentUrl() });
		if (networkIsOnline()) {
			this.swup.hooks.callSync('network:online', visit, undefined);
		} else {
			this.swup.hooks.callSync('network:offline', visit, undefined);
		}
	};

	/**
	 * Before core page load: return existing preload promise if available.
	 */
	protected onPageLoad: HookDefaultHandler<'page:load'> = async (visit, args, defaultHandler) => {
		if (!networkIsOnline()) {
			const page = this.getOfflinePage();
			if (page) {
				return page;
			}
		}
		return defaultHandler!(visit, args);
	};

	public preloadOfflinePage(): Promise<PageData> {
		const { url } = Location.fromUrl(this.options.offlinePage);
		return this.swup.fetchPage(url);
	}

	public getOfflinePage(): PageData | undefined {
		const { url } = Location.fromUrl(this.options.offlinePage);
		return this.swup.cache.get(url);
	}
}

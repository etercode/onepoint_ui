import { browser } from '$app/environment';
import * as api from '$lib/api/client';
import { getAccessToken } from '$lib/auth/session';

	class AuthState {
	/** @type {null | {
	 *   id: number,
	 *   email: string,
	 *   username: string,
	 *   name: string,
	 *   lastname: string,
	 *   timezone?: string | null,
	 *   language?: string | null,
	 *   birthday?: string | null,
	 *   description?: string | null,
	 *   statusText?: string | null,
	 *   profilePhoto?: string | null,
	 *   profilePhotoUrl?: string | null
	 * }} */
	user = $state(null);
	loading = $state(false);
	initialized = $state(false);

	get isAuthenticated() {
		return browser && getAccessToken() !== null;
	}

	async init() {
		if (!browser || this.initialized) return;
		this.initialized = true;
		if (!this.isAuthenticated) return;
		await this.fetchUser();
	}

	async fetchUser() {
		if (!this.isAuthenticated) {
			this.user = null;
			return;
		}
		this.loading = true;
		try {
			this.user = await api.getMe();
		} catch {
			this.user = null;
		} finally {
			this.loading = false;
		}
	}

	/** @param {string} email @param {string} password */
	async login(email, password) {
		await api.login({ email, password });
		await this.fetchUser();
	}

	async logout() {
		await api.logout();
		this.user = null;
	}
}

export const auth = new AuthState();

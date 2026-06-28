import { browser } from '$app/environment';

const KEY = 'onepoint_consultations';

export const roomLabels = {
	'living-room': 'Qonaq otağı',
	bedroom: 'Yataq otağı',
	kitchen: 'Mətbəx / yemək otağı',
	kids: 'Uşaq otağı',
	office: 'Ev ofisi'
};

/** @typedef {{ id: string, name: string, phone: string, room: string, message: string, createdAt: string, status: 'new' | 'contacted' | 'closed' }} Consultation */

/** @returns {Consultation[]} */
export function loadConsultations() {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

/** @param {Omit<Consultation, 'id' | 'createdAt' | 'status'>} data */
export function saveConsultation(data) {
	if (!browser) return;
	const list = loadConsultations();
	const entry = {
		...data,
		id: `c-${Date.now()}`,
		createdAt: new Date().toISOString(),
		status: /** @type {const} */ ('new')
	};
	localStorage.setItem(KEY, JSON.stringify([entry, ...list]));
}

/** @param {string} id @param {Consultation['status']} status */
export function updateConsultationStatus(id, status) {
	if (!browser) return;
	const list = loadConsultations().map((c) => (c.id === id ? { ...c, status } : c));
	localStorage.setItem(KEY, JSON.stringify(list));
}

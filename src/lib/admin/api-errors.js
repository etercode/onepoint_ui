import { ApiClientError } from '$lib/api/client';

/** @type {Record<string, string>} */
const MESSAGES = {
	slug_already_used: 'Bu ad artıq istifadə olunub (slug mövcuddur).',
	invalid_category: 'Kateqoriya seçimi düzgün deyil.',
	invalid_collection: 'Kolleksiya seçimi düzgün deyil.',
	category_has_products: 'Əvvəlcə məhsulları başqa kateqoriyaya köçürün.',
	collection_has_products: 'Əvvəlcə məhsulları başqa kolleksiyaya köçürün.'
};

/** @param {unknown} err */
export function formatAdminError(err) {
	if (err instanceof ApiClientError) {
		const code = err.body && typeof err.body === 'object' && 'error' in err.body
			? String(err.body.error)
			: '';
		if (code && MESSAGES[code]) return MESSAGES[code];
		return err.message;
	}
	if (err instanceof Error) return err.message;
	return 'Əməliyyat alınmadı.';
}

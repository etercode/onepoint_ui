/** Comma-separated admin emails in VITE_ADMIN_EMAILS. Empty = any authenticated user (dev). */
export function getAdminEmails() {
	const raw = import.meta.env.VITE_ADMIN_EMAILS ?? '';
	return raw
		.split(',')
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean);
}

/** @param {{ email?: string } | null | undefined} user */
export function isAdminUser(user) {
	if (!user?.email) return false;
	const allowed = getAdminEmails();
	if (allowed.length === 0) return true;
	return allowed.includes(user.email.toLowerCase());
}

/** @param {{ roles?: string[] } | null | undefined} user */
export function isAdminUser(user) {
	return user?.roles?.includes('ROLE_ADMIN') ?? false;
}

export function isValidPassword(password: string) {
	if (password.length < 7 || password.length > 30) return false;

	return true;
}

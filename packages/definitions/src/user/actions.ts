class UserActionNames {
	logout = (username: string) => `Logout ${username}`;
	changePassword = `Change password`;
	export = `Export all data (Grow runs, Resources)`;
	deleteUser = (username: string) => `Delete user ${username}`;
}

export const userActionNames = new UserActionNames();

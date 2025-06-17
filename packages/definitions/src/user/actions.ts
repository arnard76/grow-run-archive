class UserActionNames {
	logout = (username: string) => `Logout ${username}`;
	changePassword = `Change password`;
	export = `Export all data (Grow runs, Resources)`;
}

export const userActionNames = new UserActionNames();

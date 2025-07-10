export async function getUser(username: string, password: string) {
	const verifyUserApiUrl =
		process.env.PUBLIC_ENV === 'test' && process.env.FIREBASE_AUTH_EMULATOR_HOST
			? `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.SECRET_FIREBASE_API_KEY}`
			: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.SECRET_FIREBASE_API_KEY}`;
	const verifyUserPayload = JSON.stringify({
		email: username,
		password
	});

	const verifyUserResponse = await fetch(verifyUserApiUrl, {
		method: 'post',
		headers: { 'Content-Type': 'application/json' },
		body: verifyUserPayload
	});

	const verifyUserResponsePayload = await verifyUserResponse.json();

	if (verifyUserResponse.status === 200) return verifyUserResponsePayload;
}

import { config } from 'dotenv';

config();

export async function getUser(username: string, password: string) {
	const verifyUserApiUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.SECRET_FIREBASE_API_KEY}`;
	const verifyUserPayload = JSON.stringify({
		email: username,
		password
	});

	const verifyUserResponse = await fetch(verifyUserApiUrl, {
		method: 'post',
		body: verifyUserPayload
	});

	const verifyUserResponsePayload = await verifyUserResponse.json();

	if (verifyUserResponse.status === 200) return verifyUserResponsePayload;
}

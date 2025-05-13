import { createTransport } from 'nodemailer';
// import {
// 	SECRET_BREVO_CLIENT_EMAIL as user,
// 	SECRET_BREVO_CLIENT_PASS as pass
// } from '$env/static/private';

import { config } from 'dotenv';
config();

export const mailer = createTransport({
	host: 'smtp-relay.brevo.com',
	port: 587,
	auth: { user: process.env.SECRET_BREVO_CLIENT_EMAIL, pass: process.env.SECRET_BREVO_CLIENT_PASS }
});

import { createTransport } from 'nodemailer';

export const mailer = createTransport({
	host: 'smtp-relay.brevo.com',
	port: 587,
	auth: { user: process.env.SECRET_BREVO_CLIENT_EMAIL, pass: process.env.SECRET_BREVO_CLIENT_PASS }
});

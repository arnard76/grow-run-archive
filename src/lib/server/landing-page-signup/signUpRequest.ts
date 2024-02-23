import { createTransport } from 'nodemailer';
import {
	SECRET_BREVO_CLIENT_EMAIL as user,
	SECRET_BREVO_CLIENT_PASS as pass
} from '$env/static/private';

const brevoTransport = createTransport({
	host: 'smtp-relay.brevo.com',
	port: 587,
	auth: { user, pass }
});

export async function handler({ 'user-email': userEmail }: { 'user-email': string }) {
	if (!userEmail) throw Error('user email not provided');

	let mainText = `What should happen now? Give ${userEmail} their own GRA so that they can't see yours and you can't see theirs.`;
	let message = {
		to: 'growrunarchive@gmail.com',
		from: 'arnard76@gmail.com',
		subject: `Grow Run Archive - ${userEmail} has requested to sign-up!`,
		text: mainText,
		html: `<img src='https://c.tenor.com/rePUPZVv9loAAAAC/tenor.gif'><p>${mainText}</p>`
	};

	const info = await brevoTransport.sendMail(message);
	console.log(JSON.stringify(info));
}

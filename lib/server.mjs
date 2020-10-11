import fastify from 'fastify';
import initApp from './app.mjs';

const main = async () => {
	const app = fastify({logger: {prettyPrint: true}});
	initApp(app);
	await app.ready();

	const {host, port} = app.config;
	app.listen(port, host);
};

main().catch((err) => {
	// eslint-disable-next-line no-console
	console.error('Error ocurred: ', (err && err.stack) || err);
});

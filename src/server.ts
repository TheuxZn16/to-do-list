import app from './app';
const PORT = Number(process.env.PORT);
try {
	app.listen({
		host: '0.0.0.0',
		port: PORT || 4000,
	});
} catch (error) {
	console.error('Error starting the server:', error);
	process.exit(1);
}

import app from './app';

try {
	app.listen({ port: 4000 });
} catch (error) {
	console.error('Error starting the server:', error);
	process.exit(1);
}

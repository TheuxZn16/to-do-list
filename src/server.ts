import app from './app';

try {
	app.listen({ port: Number(process.env.PORT) || 4000 });
	console.log(`Server is running on http://localhost:${process.env.PORT}`);
} catch (error) {
	console.error('Error starting the server:', error);
	process.exit(1);
}

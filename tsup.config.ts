import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/**/*.ts'],
	format: ['cjs', 'esm'],
	external: ['src/prisma/**'],
});

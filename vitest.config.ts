import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "happy-dom",
		setupFiles: ["./tests/setup.ts"],
		coverage: {
			provider: "v8",
			include: ["src/**/*.ts"],
			exclude: [
				"src/**/*.test.ts",
				"src/**/*.spec.ts",
				"tests/**/*",
				"dist/**/*",
				"node_modules/**/*",
				"**/*.d.ts",
			],
			reporter: ["text", "json", "html"],
			reportsDirectory: "./coverage",
		},
	},
});

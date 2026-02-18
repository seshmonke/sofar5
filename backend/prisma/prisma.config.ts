const defineConfig = (config: Record<string, unknown>): Record<string, unknown> => config;

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

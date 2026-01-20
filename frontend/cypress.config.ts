import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      config.env["codeCoverage"] = config.env["codeCoverage"] || {};
      config.env["codeCoverage"].exclude = ['src/app/core/interceptors/auth.interceptor.ts'];
      return config;
    },
  },
});

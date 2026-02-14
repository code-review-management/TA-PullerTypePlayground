/**
 * Docs:
 * 1. https://stackoverflow.com/questions/69461972/typescript-says-nextjs-environment-variables-are-undefined
 */

declare namespace NodeJS {
  interface ProcessEnv {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    AUTH_GITHUB_ID: string;
    AUTH_GITHUB_SECRET: string;
    AUTH_SECRET: string;
    APP_ID: string;
    WEBHOOK_SECRET: string;
    PRIVATE_KEY_PATH: string;
  }
}

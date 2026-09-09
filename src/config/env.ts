/** Public env for the PortAventura planner (template: config/env.ts). */

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "",
} as const;

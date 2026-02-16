import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  VITE_APP_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase Anon Key is required'),
  VITE_APP_ENV: z.enum(['development', 'production', 'test']).default('development'),
  VITE_SESSION_TIMEOUT: z.string().optional().transform((val) => {
    if (!val) return 24 * 60 * 60 * 1000; // Default: 24 hours
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 24 * 60 * 60 * 1000 : parsed;
  })
});

type EnvConfig = z.infer<typeof envSchema>;

function validateEnv(): EnvConfig {
  try {
    const env = envSchema.parse({
      VITE_APP_SUPABASE_URL: import.meta.env.VITE_APP_SUPABASE_URL,
      VITE_APP_SUPABASE_ANON_KEY: import.meta.env.VITE_APP_SUPABASE_ANON_KEY,
      VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
      VITE_SESSION_TIMEOUT: import.meta.env.VITE_SESSION_TIMEOUT
    });
    
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.')).join(', ');
      throw new Error(
        `Environment validation failed. Missing or invalid variables: ${missingVars}. ` +
        'Please check your .env file and ensure all required variables are set correctly.'
      );
    }
    throw error;
  }
}

export const env = validateEnv();

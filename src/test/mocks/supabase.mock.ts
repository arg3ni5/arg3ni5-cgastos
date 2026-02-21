// Mock Supabase client for testing
// Note: This file requires vitest to be installed. Run: npm install -D vitest
// Uncomment the imports below after installing vitest:
// import { vi } from 'vitest';

export const mockSupabaseClient = {
  from: () => mockSupabaseClient,
  select: () => mockSupabaseClient,
  insert: () => mockSupabaseClient,
  update: () => mockSupabaseClient,
  delete: () => mockSupabaseClient,
  eq: () => mockSupabaseClient,
  single: () => mockSupabaseClient,
  maybeSingle: () => mockSupabaseClient,
  order: () => mockSupabaseClient,
  rpc: () => mockSupabaseClient,
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null })
  }
};

// Helper to reset all mocks
// After installing vitest, you can implement proper mock reset functionality
export function resetSupabaseMocks() {
  // Placeholder - implement with vi.fn() after installing vitest
  console.log('Reset mocks - install vitest to use vi.fn() functionality');
}

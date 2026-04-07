import { seedAdmin, ensureExtensions } from "./db";

// Singleton pattern to ensure initialization only runs once per process
let initialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Initialize the application database
 * Ensures extensions are created and admin tables exist, seeds default admin if none exists
 * This function is idempotent and safe to call multiple times
 */
export async function initializeApp() {
  // If already initialized, return immediately
  if (initialized) {
    return;
  }

  // If initialization is in progress, wait for it
  if (initPromise) {
    return initPromise;
  }

  // Start initialization
  initPromise = (async () => {
    try {
      // Create extensions first (only happens once)
      await ensureExtensions();
      // Then seed admin user if needed
      await seedAdmin();
      initialized = true;
    } catch (error) {
      console.error("Application initialization failed:", error);
      initPromise = null;
      throw error;
    }
  })();

  return initPromise;
}

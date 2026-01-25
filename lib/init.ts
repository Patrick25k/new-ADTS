import { seedAdmin } from './db'

// Singleton pattern to ensure initialization only runs once per process
let initialized = false
let initPromise: Promise<void> | null = null

/**
 * Initialize the application database
 * Ensures admin tables exist and seeds default admin if none exists
 * This function is idempotent and safe to call multiple times
 */
export async function initializeApp() {
    // If already initialized, return immediately
    if (initialized) {
        return
    }

    // If initialization is in progress, wait for it
    if (initPromise) {
        return initPromise
    }

    // Start initialization
    initPromise = (async () => {
        try {
            await seedAdmin()
            initialized = true
        } catch (error) {
            console.error('Application initialization failed:', error)
            initPromise = null
            throw error
        }
    })()

    return initPromise
}

/**
 * Startup initialization module
 * Runs once when the application starts to initialize critical resources
 */

import { initializeApp } from "./init";

// Track if startup has been called
let startupCalled = false;

/**
 * Initialize the application on startup
 * Called from the root layout to ensure database extensions and tables are created
 */
export async function initializeOnStartup() {
  if (startupCalled) {
    return;
  }

  startupCalled = true;

  try {
    // Initialize database (create extensions, tables, seed admin if needed)
    await initializeApp();
    console.log("Application startup initialization completed successfully");
  } catch (error) {
    console.error("Application startup initialization failed:", error);
    // Don't throw - let the app continue but log the error
  }
}

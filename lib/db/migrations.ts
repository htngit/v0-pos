import { db } from './index';

// Migration functions to handle database schema updates
export const runMigrations = async () => {
  console.log('Running database migrations...');
  
  // Migration functions will be added as needed for future schema changes
  // Currently, all migrations are handled in the main database versioning
  
  console.log('Database migrations completed.');
};

// Initialize the database and run migrations
export const initializeDB = async () => {
  try {
    // Open the database to ensure it's ready for use
    await db.open();
    console.log('Database initialized successfully');
    
    // Run any pending migrations
    await runMigrations();
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
import { MongoClient, Db }           from 'mongodb';
import { log_error }                  from '../utils/error_logger';

// - DATABASE CONFIGURATION - \\

const __mongo_uri        = process.env.MONGO_URI || 'mongodb://localhost:27017';
const __db_name          = process.env.DB_NAME || 'catalog_bot';

let __mongo_client: MongoClient | null = null;
let __database      : Db | null = null;

/**
 * Initialize database connection
 * @return Promise<Db>
 */
const setup_database = async (): Promise<Db> => {
  try {
    __mongo_client        = new MongoClient(__mongo_uri);

    await __mongo_client.connect();

    console.log('[ - DATABASE - ] MongoDB connection established successfully');

    __database            = __mongo_client.db(__db_name);

    // - CREATE INDEXES - \\
    
    await create_indexes(__database);

    return __database;
  } catch (error) {
    await log_error(error);
    console.log('[ - DATABASE - ] Failed to establish MongoDB connection');
    throw error;
  }
};

/**
 * Create database indexes
 * @param database Db
 * @return Promise<void>
 */
const create_indexes = async (database: Db): Promise<void> => {
  try {
    const games_collection     = database.collection('games');
    const vendors_collection   = database.collection('vendors');

    await games_collection.createIndex({ game_id: 1 }, { unique: true });
    await vendors_collection.createIndex({ game_id: 1, name: 1 });

    console.log('[ - DATABASE - ] Database indexes created successfully');
  } catch (error) {
    await log_error(error);
    console.log('[ - DATABASE - ] Failed to create indexes');
    throw error;
  }
};

/**
 * Get database instance
 * @return Db | null
 */
const get_database = (): Db | null => {
  return __database;
};

/**
 * Close database connection
 * @return Promise<void>
 */
const close_database = async (): Promise<void> => {
  try {
    if (__mongo_client) {
      await __mongo_client.close();
      console.log('[ - DATABASE - ] MongoDB connection closed');
      __mongo_client = null;
      __database     = null;
    }
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

// - EXPORTS - \\

export {
  setup_database,
  get_database,
  close_database
};

import { Pool }                     from 'mysql2/promise';
import { initialize_database }      from '../services/catalog_service';
import { log_error }                from '../utils/error_logger';

// - DATABASE CONFIGURATION - \\

const __db_config     = {
  host     : process.env.DB_HOST || 'localhost',
  user     : process.env.DB_USER || 'root',
  password : process.env.DB_PASSWORD || '',
  database : process.env.DB_NAME || 'catalog_bot',
  port     : Number(process.env.DB_PORT) || 3306
};

const __pool_config   = {
  connectionLimit : 10,
  waitForConnections: true,
  queueLimit      : 0
};

let __db_pool: Pool | null = null;

/**
 * Initialize database connection
 * @return Promise<Pool>
 */
const setup_database = async (): Promise<Pool> => {
  try {
    __db_pool               = new Pool({
      host                  : __db_config.host,
      user                  : __db_config.user,
      password              : __db_config.password,
      database              : __db_config.database,
      port                  : __db_config.port,
      connectionLimit       : __pool_config.connectionLimit,
      waitForConnections    : __pool_config.waitForConnections,
      queueLimit            : __pool_config.queueLimit
    });

    const connection        = await __db_pool.getConnection();
    console.log('[ - DATABASE - ] Database connection established successfully');
    connection.release();

    initialize_database(__db_pool);

    return __db_pool;
  } catch (error) {
    await log_error(error);
    console.log('[ - DATABASE - ] Failed to establish database connection');
    throw error;
  }
};

/**
 * Get database pool
 * @return Pool | null
 */
const get_database_pool = (): Pool | null => {
  return __db_pool;
};

/**
 * Close database connection
 * @return Promise<void>
 */
const close_database = async (): Promise<void> => {
  try {
    if (__db_pool) {
      await __db_pool.end();
      console.log('[ - DATABASE - ] Database connection closed');
      __db_pool = null;
    }
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

// - EXPORTS - \\

export {
  setup_database,
  get_database_pool,
  close_database
};

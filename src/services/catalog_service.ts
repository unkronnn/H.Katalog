import { Pool, PoolClient, ResultSetHeader } from 'mysql2/promise';
import { log_error }                   from '../utils/error_logger';

// - INTERFACE DEFINITIONS - \\

/**
 * Vendor detail interface
 */
interface vendor_detail {
  name          : string;
  price         : number;
  features_list : string[];
  stock_status  : 'available' | 'out_of_stock' | 'pre_order';
}

/**
 * Game category interface
 */
interface game_category {
  game_id : string;
  name    : string;
  vendors : vendor_detail[];
}

// - DATABASE CONNECTION - \\

let __db_pool: Pool | null = null;

/**
 * Initialize database connection
 * @param connection_pool Pool
 * @return void
 */
const initialize_database = (connection_pool: Pool): void => {
  __db_pool = connection_pool;
};

// - SERVICE FUNCTIONS - \\

/**
 * Get all games from database
 * @return Promise<game_category[]>
 */
const get_game_list = async (): Promise<game_category[]> => {
  try {
    if (!__db_pool) {
      throw new Error('Database not initialized');
    }

    const connection   = await __db_pool.getConnection();
    const query        = 'SELECT * FROM games ORDER BY name ASC';
    const [rows]       = await connection.execute(query);
    const games        = rows as any[];

    const game_list: game_category[] = [];

    for (const game of games) {
      const vendors = await get_vendor_detail_by_game_id(game.game_id);

      const category: game_category = {
        game_id : game.game_id,
        name    : game.name,
        vendors : vendors
      };

      game_list.push(category);
    }

    connection.release();

    return game_list;
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Get vendor detail by game ID
 * @param game_id string
 * @return Promise<vendor_detail[]>
 */
const get_vendor_detail_by_game_id = async (game_id: string): Promise<vendor_detail[]> => {
  try {
    if (!__db_pool) {
      throw new Error('Database not initialized');
    }

    const connection   = await __db_pool.getConnection();
    const query        = `
      SELECT
        v.name,
        v.price,
        v.features_list,
        v.stock_status
      FROM vendors v
      WHERE v.game_id = ?
      ORDER BY v.price ASC
    `;
    const [rows]       = await connection.execute(query, [game_id]);
    const vendors      = rows as any[];

    const vendor_list: vendor_detail[] = vendors.map((vendor) => ({
      name          : vendor.name,
      price         : vendor.price,
      features_list : JSON.parse(vendor.features_list || '[]'),
      stock_status  : vendor.stock_status
    }));

    connection.release();

    return vendor_list;
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Get vendor detail by vendor name and game ID
 * @param game_id string
 * @param vendor_name string
 * @return Promise<vendor_detail | null>
 */
const get_vendor_detail = async (game_id: string, vendor_name: string): Promise<vendor_detail | null> => {
  try {
    if (!__db_pool) {
      throw new Error('Database not initialized');
    }

    const connection   = await __db_pool.getConnection();
    const query        = `
      SELECT
        v.name,
        v.price,
        v.features_list,
        v.stock_status
      FROM vendors v
      WHERE v.game_id = ? AND v.name = ?
      LIMIT 1
    `;
    const [rows]       = await connection.execute(query, [game_id, vendor_name]);
    const vendors      = rows as any[];

    if (vendors.length === 0) {
      connection.release();
      return null;
    }

    const vendor: vendor_detail = {
      name          : vendors[0].name,
      price         : vendors[0].price,
      features_list : JSON.parse(vendors[0].features_list || '[]'),
      stock_status  : vendors[0].stock_status
    };

    connection.release();

    return vendor;
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Add new game to database
 * @param game_id string
 * @param name string
 * @return Promise<boolean>
 */
const add_game = async (game_id: string, name: string): Promise<boolean> => {
  try {
    if (!__db_pool) {
      throw new Error('Database not initialized');
    }

    const connection     = await __db_pool.getConnection();
    const query          = 'INSERT INTO games (game_id, name) VALUES (?, ?)';
    const [result]       = await connection.execute(query, [game_id, name]);
    const insert_result  = result as ResultSetHeader;

    connection.release();

    return insert_result.affectedRows > 0;
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Add vendor to game
 * @param game_id string
 * @param vendor vendor_detail
 * @return Promise<boolean>
 */
const add_vendor = async (game_id: string, vendor: vendor_detail): Promise<boolean> => {
  try {
    if (!__db_pool) {
      throw new Error('Database not initialized');
    }

    const connection         = await __db_pool.getConnection();
    const features_json      = JSON.stringify(vendor.features_list);
    const query              = `
      INSERT INTO vendors (game_id, name, price, features_list, stock_status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result]           = await connection.execute(
      query,
      [
        game_id,
        vendor.name,
        vendor.price,
        features_json,
        vendor.stock_status
      ]
    );
    const insert_result      = result as ResultSetHeader;

    connection.release();

    return insert_result.affectedRows > 0;
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Update vendor stock status
 * @param game_id string
 * @param vendor_name string
 * @param stock_status 'available' | 'out_of_stock' | 'pre_order'
 * @return Promise<boolean>
 */
const update_vendor_stock = async (
  game_id      : string,
  vendor_name  : string,
  stock_status : 'available' | 'out_of_stock' | 'pre_order'
): Promise<boolean> => {
  try {
    if (!__db_pool) {
      throw new Error('Database not initialized');
    }

    const connection     = await __db_pool.getConnection();
    const query          = `
      UPDATE vendors
      SET stock_status = ?
      WHERE game_id = ? AND name = ?
    `;
    const [result]       = await connection.execute(query, [stock_status, game_id, vendor_name]);
    const update_result  = result as ResultSetHeader;

    connection.release();

    return update_result.affectedRows > 0;
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Delete vendor from game
 * @param game_id string
 * @param vendor_name string
 * @return Promise<boolean>
 */
const delete_vendor = async (game_id: string, vendor_name: string): Promise<boolean> => {
  try {
    if (!__db_pool) {
      throw new Error('Database not initialized');
    }

    const connection     = await __db_pool.getConnection();
    const query          = `
      DELETE FROM vendors
      WHERE game_id = ? AND name = ?
    `;
    const [result]       = await connection.execute(query, [game_id, vendor_name]);
    const delete_result  = result as ResultSetHeader;

    connection.release();

    return delete_result.affectedRows > 0;
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

// - EXPORTS - \\

export {
  vendor_detail,
  game_category,
  initialize_database,
  get_game_list,
  get_vendor_detail,
  get_vendor_detail_by_game_id,
  add_game,
  add_vendor,
  update_vendor_stock,
  delete_vendor
};

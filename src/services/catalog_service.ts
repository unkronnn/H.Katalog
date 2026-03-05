import { Db }                          from 'mongodb';
import { get_database }                 from '../config/database';
import { log_error }                    from '../utils/error_logger';

// - INTERFACE DEFINITIONS - \\

interface vendor_detail {
  name          : string;
  price         : number;
  features_list : string[];
  stock_status  : 'available' | 'out_of_stock' | 'pre_order';
}

interface game_category {
  game_id : string;
  name    : string;
  vendors : vendor_detail[];
}

// - DATABASE HELPER - \\

const __get_db = (): Db => {
  const db = get_database();
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

// - SERVICE FUNCTIONS - \\

const get_game_list = async (): Promise<game_category[]> => {
  try {
    const db                = __get_db();
    const games_collection  = db.collection('games');
    const games             = await games_collection.find({}).sort({ name: 1 }).toArray();
    const game_list: game_category[] = [];

    for (const game of games as any[]) {
      const vendors = await get_vendor_detail_by_game_id(game.game_id);
      const category: game_category = {
        game_id : game.game_id,
        name    : game.name,
        vendors : vendors
      };
      game_list.push(category);
    }

    return game_list;
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

const get_vendor_detail_by_game_id = async (game_id: string): Promise<vendor_detail[]> => {
  try {
    const db                = __get_db();
    const vendors_collection  = db.collection('vendors');
    const vendors           = await vendors_collection.find({ game_id: game_id }).sort({ price: 1 }).toArray();

    return vendors.map((vendor: any) => ({
      name          : vendor.name,
      price         : vendor.price,
      features_list : vendor.features_list || [],
      stock_status  : vendor.stock_status
    }));
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

const get_vendor_detail = async (game_id: string, vendor_name: string): Promise<vendor_detail | null> => {
  try {
    const db                = __get_db();
    const vendors_collection  = db.collection('vendors');
    const vendor             = await vendors_collection.findOne({ game_id: game_id, name: vendor_name });

    if (!vendor) {
      return null;
    }

    return {
      name          : vendor.name,
      price         : vendor.price,
      features_list : vendor.features_list || [],
      stock_status  : vendor.stock_status
    };
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

const add_game = async (game_id: string, name: string): Promise<boolean> => {
  try {
    const db                = __get_db();
    const games_collection  = db.collection('games');
    const result            = await games_collection.insertOne({
      game_id: game_id,
      name   : name,
      created_at: new Date()
    });

    return result.acknowledged;
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

const add_vendor = async (game_id: string, vendor: vendor_detail): Promise<boolean> => {
  try {
    const db                = __get_db();
    const vendors_collection  = db.collection('vendors');
    const result            = await vendors_collection.insertOne({
      game_id      : game_id,
      name         : vendor.name,
      price        : vendor.price,
      features_list: vendor.features_list,
      stock_status : vendor.stock_status,
      created_at   : new Date()
    });

    return result.acknowledged;
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

const update_vendor_stock = async (
  game_id      : string,
  vendor_name  : string,
  stock_status : 'available' | 'out_of_stock' | 'pre_order'
): Promise<boolean> => {
  try {
    const db                = __get_db();
    const vendors_collection  = db.collection('vendors');
    const result            = await vendors_collection.updateOne(
      { game_id: game_id, name: vendor_name },
      { $set: { stock_status: stock_status } }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

const delete_vendor = async (game_id: string, vendor_name: string): Promise<boolean> => {
  try {
    const db                = __get_db();
    const vendors_collection  = db.collection('vendors');
    const result            = await vendors_collection.deleteOne({
      game_id: game_id,
      name   : vendor_name
    });

    return result.deletedCount > 0;
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

// - EXPORTS - \\

export {
  vendor_detail,
  game_category,
  get_game_list,
  get_vendor_detail,
  get_vendor_detail_by_game_id,
  add_game,
  add_vendor,
  update_vendor_stock,
  delete_vendor
};

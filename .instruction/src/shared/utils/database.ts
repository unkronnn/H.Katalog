import { MongoClient, Db, Collection, Document } from "mongodb"

let client: MongoClient | null = null
let db: Db | null = null
let connected = false

export async function connect(): Promise<Db | null> {
  if (db) return db

  const mongo_uri = process.env.MONGO_URI
  const db_name   = process.env.MONGO_DB_NAME || "envy"

  if (!mongo_uri) {
    console.error("[ - MONGODB - ] MONGO_URI not found in environment variables")
    return null
  }

  try {
    client = new MongoClient(mongo_uri, {
      maxPoolSize: 20,
      minPoolSize: 2,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    })

    await client.connect()
    db = client.db(db_name)

    await db.command({ ping: 1 })

    connected = true

    console.log("[ - MONGODB - ] Connected to MongoDB successfully")
    console.log(`[ - MONGODB - ] Database: ${db_name}`)

    await create_indexes()

    return db
  } catch (err) {
    console.error("[ - MONGODB - ] Connection failed:", (err as Error).message)
    console.log("[ - MONGODB - ] Bot will continue without database features")
    return null
  }
}

export function is_connected(): boolean {
  return connected && db !== null
}

export function get_db(): Db {
  if (!db) throw new Error("Database not connected")
  return db
}

export function get_pool(): Db {
  if (!db) throw new Error("Database not connected")
  return db
}

export function get_pool_stats() {
  if (!client) return null

  return {
    total: client.options.maxPoolSize,
    idle: 0,
    waiting: 0,
  }
}

export function get_collection<T extends Document = Document>(name: string): Collection<T> {
  if (!db) throw new Error("Database not connected")
  return db.collection<T>(name)
}

export async function disconnect(): Promise<void> {
  if (client) {
    await client.close()
    client = null
    db = null
    connected = false
    console.log("[ - MONGODB - ] Disconnected")
  }
}

async function create_indexes(): Promise<void> {
  if (!db) return

  try {
    await db.collection("reputation_records").createIndex({ user_id: 1, guild_id: 1 }, { unique: true })
    await db.collection("voice_channel_records").createIndex({ user_id: 1, guild_id: 1 })
    await db.collection("server_tag_users").createIndex({ user_id: 1, guild_id: 1 }, { unique: true })
    await db.collection("free_script_users").createIndex({ user_id: 1 }, { unique: true })
    await db.collection("loa_requests").createIndex({ message_id: 1 })
    await db.collection("loa_requests").createIndex({ status: 1, end_date: 1 })
    await db.collection("warnings").createIndex({ guild_id: 1, user_id: 1 })
    await db.collection("guild_settings").createIndex({ guild_id: 1 }, { unique: true })
    await db.collection("generic_data").createIndex({ collection: 1 })
    await db.collection("tempvoice_saved_settings").createIndex({ user_id: 1 }, { unique: true })
    await db.collection("middleman_service_status").createIndex({ guild_id: 1 }, { unique: true })
    await db.collection("jkt48_guild_notification_settings").createIndex({ guild_id: 1, platform: 1 }, { unique: true })
    await db.collection("service_provider_user_cache").createIndex({ user_id: 1 }, { unique: true })
    await db.collection("hwid_reset_tracker").createIndex({ timestamp: 1 })

    console.log("[ - MONGODB - ] Indexes created successfully")
  } catch (err) {
    console.error("[ - MONGODB - ] Error creating indexes:", (err as Error).message)
  }
}

export async function find_one<T extends Document>(
  coll: string,
  filter: object
): Promise<T | null> {
  const collection = get_collection<T>(coll)
  return await collection.findOne<T>(filter)
}

export async function find_many<T extends Document>(
  coll: string,
  filter: object = {}
): Promise<T[]> {
  const collection = get_collection<T>(coll)
  return await collection.find<T>(filter).toArray()
}

export async function insert_one<T extends Document>(
  coll: string,
  doc: any
): Promise<string> {
  const collection = get_collection(coll)
  const result = await collection.insertOne(doc)
  return result.insertedId.toString()
}

export async function update_one<T extends Document>(
  coll: string,
  filter: object,
  update: any,
  upsert: boolean = false
): Promise<boolean> {
  const collection = get_collection<T>(coll)

  const result = await collection.updateOne(
    filter,
    { $set: update },
    { upsert }
  )

  return result.matchedCount > 0 || result.upsertedCount > 0
}

export async function delete_one(
  coll: string,
  filter: object
): Promise<boolean> {
  const collection = get_collection(coll)
  const result = await collection.deleteOne(filter)
  return result.deletedCount > 0
}

export async function delete_many(
  coll: string,
  filter: object
): Promise<number> {
  const collection = get_collection(coll)
  const result = await collection.deleteMany(filter)
  return result.deletedCount || 0
}

export async function increment(
  coll: string,
  filter: object,
  field: string,
  amount: number = 1
): Promise<void> {
  const collection = get_collection(coll)

  const existing = await collection.findOne(filter)

  if (existing) {
    await collection.updateOne(
      filter,
      { $inc: { [field]: amount } }
    )
  } else {
    await collection.insertOne({
      ...filter,
      [field]: amount,
    })
  }
}

export async function count(
  coll: string,
  filter: object = {}
): Promise<number> {
  const collection = get_collection(coll)
  return await collection.countDocuments(filter)
}

export async function find_many_sorted<T extends Document>(
  coll: string,
  filter: object = {},
  sort_field: string,
  sort_order: "ASC" | "DESC" = "ASC"
): Promise<T[]> {
  const collection = get_collection<T>(coll)
  const sort_direction = sort_order === "ASC" ? 1 : -1

  return await collection
    .find<T>(filter)
    .sort({ [sort_field]: sort_direction })
    .toArray()
}

export async function update_jsonb_field(
  coll: string,
  filter: object,
  jsonb_field: string,
  jsonb_key: string,
  increment_value: number
): Promise<boolean> {
  const collection = get_collection(coll)

  const existing = await collection.findOne(filter)

  if (!existing) {
    await collection.insertOne({
      ...filter,
      [jsonb_field]: { [jsonb_key]: increment_value },
      total: increment_value,
    })
    return true
  }

  const current_jsonb = (existing as any)[jsonb_field] || {}
  const current_value = current_jsonb[jsonb_key] || 0
  current_jsonb[jsonb_key] = current_value + increment_value

  await collection.updateOne(
    filter,
    {
      $set: {
        [jsonb_field]: current_jsonb,
      },
      $inc: { total: increment_value },
    }
  )

  return true
}

export async function raw_query<T = any>(query: string, values: any[] = []): Promise<T[]> {
  console.warn("[ - MONGODB - ] raw_query not supported in MongoDB, returning empty array")
  return []
}

export async function cleanup_expired_bypass_cache(): Promise<void> {
  try {
    const collection = get_collection("bypass_cache")
    const result = await collection.deleteMany({
      expires_at: { $lt: new Date() },
    })

    if (result.deletedCount && result.deletedCount > 0) {
      console.log(`[ - BYPASS CACHE - ] Cleaned up ${result.deletedCount} expired entries`)
    }
  } catch (error) {
    console.error(`[ - BYPASS CACHE - ] Cleanup failed:`, error)
  }
}

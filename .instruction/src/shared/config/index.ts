/**
 * - CENTRALIZED CONFIGURATION - \\
 * Semua konfigurasi dibaca dari environment variables (.env)
 */

/**
 * - SERVER & CHANNEL CONFIGS - \\
 */
export const config = {
  // Main Server
  main_guild_id:                process.env.MAIN_GUILD_ID || "",
  persistent_typing_channel_id: process.env.PERSISTENT_TYPING_CHANNEL_ID || "",
  voice_channel_id:             process.env.VOICE_CHANNEL_ID || "",

  // Important Channels
  devlog_channel_id:            process.env.DEVLOG_CHANNEL_ID || "",
  bug_report_channel_id:        process.env.BUG_REPORT_CHANNEL_ID || "",
  feature_suggestion_channel_id: process.env.FEATURE_SUGGESTION_CHANNEL_ID || "",
  purchase_channel_id:          process.env.PURCHASE_CHANNEL_ID || "",
  marketplace_forum_id:         process.env.MARKETPLACE_FORUM_ID || "",

  // Roles
  priority_role_id:             process.env.PRIORITY_ROLE_ID || "",
  luarmor_script_role_id:       process.env.LUARMOR_SCRIPT_ROLE_ID || "",

  // API Keys
  luarmor_api_key:              process.env.LUARMOR_API_KEY || "",
  luarmor_project_id:           process.env.LUARMOR_PROJECT_ID || "",
  bypass_api_url:               process.env.BYPASS_API_URL || "",
  bypass_api_key:               process.env.BYPASS_API_KEY || "",

  // Database
  mongo_uri:                    process.env.MONGO_URI || "",
  mongo_db_name:                process.env.MONGO_DB_NAME || "envy_bot",
  database_url:                 process.env.DATABASE_URL || "",

  // Web Server
  port:                         parseInt(process.env.PORT || process.env.WEBHOOK_PORT || "3456", 10),
  public_url:                   process.env.PUBLIC_URL || `http://localhost:3456`,
  web_url:                      process.env.WEB_URL || "",

  // Environment
  node_env:                     process.env.NODE_ENV || "production",
  debug:                        process.env.DEBUG === "true",
} as const

/**
 * - VALIDATE REQUIRED CONFIGS - \\
 * @returns {boolean} True if all required configs are present
 */
export function validate_config(): boolean {
  const required = [
    "main_guild_id",
    "persistent_typing_channel_id",
    "voice_channel_id",
  ]

  for (const key of required) {
    if (!config[key as keyof typeof config]) {
      console.error(`[ - CONFIG - ] Missing required config: ${key}`)
      return false
    }
  }

  return true
}

/**
 * - GET CONFIG WITH FALLBACK - \\
 * @param key - Config key
 * @param fallback - Fallback value if config is not set
 * @returns Config value or fallback
 */
export function get_config<T extends keyof typeof config>(
  key: T,
  fallback?: typeof config[T]
): typeof config[T] {
  return config[key] || (fallback as typeof config[T])
}

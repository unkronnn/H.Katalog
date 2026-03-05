import { ButtonInteraction, GuildMember }      from "discord.js"
import { component, api, format }              from "@shared/utils"
import { http, env, logger }                   from "@shared/utils"
import { remove_free_script_access }           from "@shared/database/managers/free_script_manager"
import { track_and_check_hwid_reset, create_rate_limit_message } from "../../controllers/service_provider_controller"
import { is_hwid_enabled }                     from "../../../../modules/setup/hwid_control"

const __log               = logger.create_logger("free_reset_hwid")
const FREE_PROJECT_ID     = "7586c09688accb14ee2195517f2488a0"
const FREE_SCRIPT_ROLE_ID = "1473557441110212629"
const TARGET_GUILD_ID     = "1340943252093669397"
const COOLDOWN_MS         = 3600000
const reset_cooldowns     = new Map<string, number>()

function get_api_key(): string {
  return env.required("LUARMOR_API_KEY")
}

function get_headers(): Record<string, string> {
  return {
    Authorization : get_api_key(),
  }
}

export async function handle_free_reset_hwid(interaction: ButtonInteraction): Promise<void> {
  await interaction.deferReply({ ephemeral: true })

  const hwid_enabled = await is_hwid_enabled()
  if (!hwid_enabled) {
    await api.edit_deferred_reply(interaction, component.build_message({
      components: [
        component.container({
          accent_color: component.from_hex("#ED4245"),
          components  : [
            component.text([
              "## HWID Reset Disabled",
              "HWID reset functionality is currently disabled.",
              "",
              "Please contact an administrator for assistance.",
            ]),
          ],
        }),
      ],
    }))
    return
  }

  const member      = interaction.member as GuildMember
  const user        = member.user

  if (!user.primaryGuild?.tag || user.primaryGuild.identityGuildId !== TARGET_GUILD_ID) {
    // - CEK SERVER TAG TAPI JANGAN HAPUS ROLE - \\
    await api.edit_deferred_reply(interaction, component.build_message({
      components: [
        component.container({
          accent_color: 0xED4245,
          components: [
            component.text([
              "## ❌ Server Tag Required",
              "You must wear the **ENVY server tag** to access free script features!",
              "",
              "Your verified role is safe, but you need to equip the server tag to use this button.",
            ]),
            component.divider(2),
            component.text([
              "### How to equip the server tag:",
              "",
              "**Desktop:** User Settings (⚙️) → Profile → Server Profile → Select ENVY",
              "**Mobile:** Profile → Edit → Server Profile → Select ENVY",
            ]),
            component.divider(2),
            component.text([
              "💡 Your role and access are safe - just equip the tag to use this feature!",
            ]),
          ],
        }),
      ],
    }))
    return
  }

  const now         = Date.now()
  const last_reset  = reset_cooldowns.get(member.id)

  if (last_reset && now - last_reset < COOLDOWN_MS) {
    const retry_at = Math.floor((last_reset + COOLDOWN_MS) / 1000)
    
    await api.edit_deferred_reply(interaction, component.build_message({
      components: [
        component.container({
          components: [
            component.section({
              content: [
                `## Cooldown Active`,
                `You can reset your HWID again <t:${retry_at}:R>.`,
                ``,
                `-# This cooldown prevents abuse.`,
              ],
              thumbnail : format.logo_url,
            }),
          ],
        }),
      ],
    }))
    return
  }

  try {
    // - USE V3 API ENDPOINT (NOT V4) - \\
    const check_url = `https://api.luarmor.net/v3/projects/${FREE_PROJECT_ID}/users?discord_id=${member.id}`
    const check_res = await http.get<any>(check_url, get_headers())

    __log.info("User check response:", JSON.stringify(check_res))

    // - CHECK IF RESPONSE IS VALID - \\
    if (!check_res || check_res.message === "Invalid JSON response") {
      __log.error("Invalid API response from user check:", check_res)

      await api.edit_deferred_reply(interaction, component.build_message({
        components: [
          component.container({
            components: [
              component.section({
                content: [
                  `## API Error`,
                  `Luarmor API is returning invalid responses.`,
                  ``,
                  `This could mean:`,
                  `- API key is invalid or expired`,
                  `- Luarmor service is down`,
                  `- API endpoint has changed`,
                  ``,
                  `Please contact an administrator.`,
                ],
                thumbnail : format.logo_url,
              }),
            ],
          }),
        ],
      }))
      return
    }

    let user_key: string | null = null

    // - EXTRACT USER KEY FROM V3 API RESPONSE - \\
    if (check_res.success && check_res.users && Array.isArray(check_res.users) && check_res.users.length > 0) {
      user_key = check_res.users[0].user_key
    } else if (check_res.success && check_res.user_key) {
      user_key = check_res.user_key
    }

    if (!user_key) {
      await api.edit_deferred_reply(interaction, component.build_message({
        components: [
          component.container({
            components: [
              component.section({
                content: [
                  `## No Key Found`,
                  `You don't have access to the free script.`,
                  ``,
                  `Please use the **Get Script** button first.`,
                ],
                thumbnail : format.logo_url,
              }),
            ],
          }),
        ],
      }))
      return
    }

    // - TRACK RESET ATTEMPT BEFORE API CALL - \\
    await track_and_check_hwid_reset(interaction.client, member.id)

    // - USE V3 API ENDPOINT FOR RESET - \\
    const reset_url  = `https://api.luarmor.net/v3/projects/${FREE_PROJECT_ID}/users/resethwid`
    const reset_body = { user_key }
    const reset_res  = await http.post<any>(reset_url, reset_body, get_headers())

    __log.info("Free reset hwid response:", JSON.stringify(reset_res))

    // - CHECK IF RESET RESPONSE IS VALID - \\
    if (!reset_res || reset_res.message === "Invalid JSON response") {
      __log.error("Invalid API response from HWID reset:", reset_res)

      await api.edit_deferred_reply(interaction, component.build_message({
        components: [
          component.container({
            components: [
              component.section({
                content: [
                  `## API Error`,
                  `Luarmor API returned an invalid response.`,
                  ``,
                  `The HWID reset endpoint may be down or changed.`,
                  `Please try again later or contact support.`,
                ],
                thumbnail : format.logo_url,
              }),
            ],
          }),
        ],
      }))
      return
    }

    if (reset_res.success === true || reset_res.message?.toLowerCase().includes("success")) {
      reset_cooldowns.set(member.id, now)

      await api.edit_deferred_reply(interaction, component.build_message({
        components: [
          component.container({
            components: [
              component.text("## HWID Reset Successful\nYour hardware ID has been reset successfully!"),
              component.divider(2),
              component.section({
                content: "You can now use the script on a new device.",
                accessory: component.secondary_button("View Stats", "free_get_stats"),
              }),
            ],
          }),
        ],
      }))
    } else {
      // - CHECK IF THIS IS A RATE LIMIT ERROR - \\
      const error_msg = reset_res.message || ""
      const is_ratelimit = error_msg.toLowerCase().includes("ratelimit") ||
                          error_msg.toLowerCase().includes("rate limit") ||
                          error_msg.toLowerCase().includes("too many requests")

      if (is_ratelimit) {
        // - EXTRACT RETRY-AFTER FROM RESPONSE IF AVAILABLE - \\
        const retry_after = reset_res.retry_after || 60
        await api.edit_deferred_reply(interaction, create_rate_limit_message("HWID Reset", retry_after))
      } else {
        await api.edit_deferred_reply(interaction, component.build_message({
          components: [
            component.container({
              components: [
                component.section({
                  content: [
                    `## Reset Failed`,
                    `${reset_res.message || "Failed to reset HWID"}`,
                  ],
                  thumbnail : format.logo_url,
                }),
              ],
            }),
          ],
        }))
      }
    }
  } catch (error: any) {
    __log.error("Failed to reset hwid:", error)

    // - CHECK IF THIS IS A JSON PARSE ERROR - \\
    const error_msg = error.message || error.toString() || ""
    const is_json_error = error_msg.includes("Unexpected token") || error_msg.includes("JSON") || error_msg.includes("<!doctype")

    if (is_json_error) {
      await api.edit_deferred_reply(interaction, component.build_message({
        components: [
          component.container({
            components: [
              component.section({
                content: [
                  `## API Communication Error`,
                  `Luarmor API returned an invalid response (HTML instead of JSON).`,
                  ``,
                  `This usually means:`,
                  `- API key is invalid or expired`,
                  `- Luarmor service is experiencing issues`,
                  `- API endpoints have changed`,
                  ``,
                  `**Please contact an administrator to check the API configuration.**`,
                ],
                thumbnail : format.logo_url,
              }),
            ],
          }),
        ],
      }))
      return
    }

    // - CHECK IF THIS IS A RATE LIMIT ERROR - \\
    const is_ratelimit = error_msg.toLowerCase().includes("ratelimit") ||
                        error_msg.toLowerCase().includes("rate limit") ||
                        error_msg.toLowerCase().includes("too many requests") ||
                        error.status === 429

    if (is_ratelimit) {
      // - TRY TO EXTRACT RETRY-AFTER FROM ERROR - \\
      const retry_after = error.retry_after || 60
      await api.edit_deferred_reply(interaction, create_rate_limit_message("HWID Reset", retry_after))
    } else {
      await api.edit_deferred_reply(interaction, component.build_message({
        components: [
          component.container({
            components: [
              component.section({
                content: [
                  `## Reset Failed`,
                  `An error occurred while resetting your HWID.`,
                  ``,
                  `Error: ${error_msg || "Unknown error"}`,
                ],
                thumbnail : format.logo_url,
              }),
            ],
          }),
        ],
      }))
    }
  }
}

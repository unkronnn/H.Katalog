import { ButtonInteraction, GuildMember }      from "discord.js"
import { component, api, format }              from "@shared/utils"
import { http, env, logger }                   from "@shared/utils"
import { remove_free_script_access }           from "@shared/database/managers/free_script_manager"
import { create_rate_limit_message }           from "../../controllers/service_provider_controller"

const __log               = logger.create_logger("free_stats")
const FREE_PROJECT_ID     = "7586c09688accb14ee2195517f2488a0"
const FREE_SCRIPT_ROLE_ID = "1473557441110212629"
const TARGET_GUILD_ID     = "1340943252093669397"

function get_api_key(): string {
  return env.required("LUARMOR_API_KEY")
}

function get_headers(): Record<string, string> {
  return {
    Authorization : get_api_key(),
  }
}

export async function handle_free_get_stats(interaction: ButtonInteraction): Promise<void> {
  await interaction.deferReply({ ephemeral: true })

  const member = interaction.member as GuildMember
  const user   = member.user

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
              "**Desktop:**",
              "1. User Settings (⚙️) → Edit User Profile",
              "2. Scroll to **Server Profile** section",
              "3. Select **ENVY** server",
              "4. Choose and display the **ENVY** tag",
              "",
              "**Mobile:**",
              "1. Tap your profile → Edit Profile",
              "2. Tap **Server Profile**",
              "3. Select **ENVY** server",
              "4. Choose the **ENVY** tag",
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

  try {
    // - USE V3 API ENDPOINT (NOT V4) - \\
    const check_url = `https://api.luarmor.net/v3/projects/${FREE_PROJECT_ID}/users?discord_id=${member.id}`
    const check_res = await http.get<any>(check_url, get_headers())

    let user: any = null

    if (check_res.success && check_res.users && Array.isArray(check_res.users) && check_res.users.length > 0) {
      user = check_res.users[0]
    } else if (check_res.success && check_res.user_key) {
      user = check_res
    }

    if (!user) {
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

    // - USE V3 API ENDPOINT FOR ALL USERS - \\
    const all_users_url = `https://api.luarmor.net/v3/projects/${FREE_PROJECT_ID}/users`
    const all_users_res = await http.get<any>(all_users_url, get_headers())

    let leaderboard_text = "Unable to fetch leaderboard"

    if (all_users_res.users && Array.isArray(all_users_res.users)) {
      const sorted = all_users_res.users.sort((a: any, b: any) => b.total_executions - a.total_executions)
      const rank   = sorted.findIndex((u: any) => u.discord_id === member.id) + 1
      
      if (rank > 0) {
        leaderboard_text = `You are #${rank} of ${sorted.length} users`
      } else {
        leaderboard_text = `Not ranked yet (${sorted.length} total users)`
      }
    }

    const hwid_status   = user.identifier ? "Assigned" : "Not Assigned"
    const last_reset_ts = user.last_reset > 0 ? `<t:${user.last_reset}:R>` : "Never"
    const expires_text  = user.auth_expire === -1 ? "Never" : `<t:${user.auth_expire}:R>`
    const banned_text   = user.banned === 1 ? `Yes - ${user.ban_reason || "No reason"}` : "No"
    const note_text     = user.note || "Not specified"

    const message = component.build_message({
      components: [
        component.container({
          components: [
            component.text("## Your Script Statistics\n"),
          ],
        }),
        component.container({
          components: [
            component.text([
              `- Total Executions: **${user.total_executions}**`,
              `- HWID Status: **${hwid_status}**`,
              `- Key: ||${user.user_key}||`,
              `- Total HWID Resets: **${user.total_resets}**`,
              `- Last Reset: **${last_reset_ts}**`,
              `- Expires At: **${expires_text}**`,
              `- Banned: **${banned_text}**`,
              `- Note: **${note_text}**`,
            ]),
            component.divider(2),
            component.text(`${leaderboard_text}\n`),
          ],
        }),
      ],
    })

    await api.edit_deferred_reply(interaction, message)
  } catch (error) {
    __log.error("Failed to get stats:", error)

    await api.edit_deferred_reply(interaction, create_rate_limit_message("Stats"))
  }
}

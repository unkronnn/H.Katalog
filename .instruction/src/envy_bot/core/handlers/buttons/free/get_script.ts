import { ButtonInteraction, GuildMember }      from "discord.js"
import { component, api, format }              from "@shared/utils"
import { http, env, logger, db }               from "@shared/utils"
import { remove_free_script_access }           from "@shared/database/managers/free_script_manager"
import { create_rate_limit_message }           from "../../controllers/service_provider_controller"

const __log                  = logger.create_logger("free_script")
const FREE_PROJECT_ID        = "7586c09688accb14ee2195517f2488a0"
const FREE_SCRIPT_ROLE_ID    = "1473557441110212629"
const FREE_LOADER_PROJECT_ID = "4dcd7d36f19fd9c3a5c35fc8948c7f89"
const TARGET_GUILD_ID        = "1340943252093669397"

function get_api_key(): string {
  return env.required("LUARMOR_API_KEY")
}

function get_headers(): Record<string, string> {
  return {
    Authorization : get_api_key(),
  }
}

export async function handle_free_get_script(interaction: ButtonInteraction): Promise<void> {
  const member = interaction.member as GuildMember

  await interaction.deferReply({ ephemeral: true })

  try {
    const user = member.user

    if (!user.primaryGuild?.tag || user.primaryGuild.identityGuildId !== TARGET_GUILD_ID) {
      // - CEK SERVER TAG TAPI JANGAN HAPUS ROLE - \\
      const no_tag_message = component.build_message({
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
                "### 📹 Video Tutorials:",
              ]),
              component.media_gallery([
                component.gallery_item(
                  "https://cdn.discordapp.com/attachments/1338440449249116232/1474113355558948864/ScreenRecording_02-20-2026_01-38-53_1.mov",
                  "📱 Mobile Tutorial",
                ),
                component.gallery_item(
                  "https://cdn.discordapp.com/attachments/1338440449249116232/1474113426224844911/2026-02-20_01-36-58.mp4",
                  "🖥️ Desktop Tutorial",
                ),
              ]),
            ],
          }),
        ],
      })

      await api.edit_deferred_reply(interaction, no_tag_message)
      return
    }

    const check_url = `https://api.luarmor.net/v3/projects/${FREE_PROJECT_ID}/users?discord_id=${member.id}`
    const check_res = await http.get<any>(check_url, get_headers())

    __log.info("Free script check response:", JSON.stringify(check_res))

    let user_key: string | null = null
    let user_exists = false

    if (check_res.users && Array.isArray(check_res.users) && check_res.users.length > 0) {
      user_exists = true
      user_key = check_res.users[0].user_key
    } else if (check_res.user_key) {
      user_exists = true
      user_key = check_res.user_key
    } else if (Array.isArray(check_res) && check_res.length > 0) {
      user_exists = true
      user_key = check_res[0].user_key
    }

    if (!user_exists) {
      const create_url = `https://api.luarmor.net/v3/projects/${FREE_PROJECT_ID}/users`
      const create_body = {
        discord_id : member.id,
        note       : "tab_limit 1234;",
      }

      const create_res = await http.post<any>(create_url, create_body, get_headers())

      __log.info("Free script create response:", JSON.stringify(create_res))

      if (!create_res.user_key) {
        await api.edit_deferred_reply(interaction, component.build_message({
          components: [
            component.container({
              components: [
                component.text([
                  "## Error",
                  "Failed to create your account. Please try again later",
                ]),
              ],
            }),
          ],
        }))
        return
      }

      user_key = create_res.user_key

      try {
        await member.roles.add(FREE_SCRIPT_ROLE_ID)
      } catch (error) {
        __log.error("Failed to add role:", error)
      }

      await db.update_one(
        "free_script_users",
        { user_id: member.id },
        {
          user_id    : member.id,
          guild_id   : TARGET_GUILD_ID,
          username   : member.user.username,
          user_key   : user_key,
          created_at : Date.now(),
          has_tag    : true,
        },
        true
      )
    }

    if (!user_key) {
      await api.edit_deferred_reply(interaction, component.build_message({
        components: [
          component.container({
            components: [
              component.text([
                "## Error",
                "Failed to retrieve your key. Please try again later.",
              ]),
            ],
          }),
        ],
      }))
      return
    }

    if (!member.roles.cache.has(FREE_SCRIPT_ROLE_ID)) {
      try {
        await member.roles.add(FREE_SCRIPT_ROLE_ID)
      } catch (error) {
        __log.error("Failed to add role:", error)
      }
    }

    const loader_script = [
      `script_key="${user_key}"`,
      `loadstring(game:HttpGet("https://raw.githubusercontent.com/unkronnn/EnvyScript/main/FreeLoader.lua"))()`,
    ].join("\n")

    const message = component.build_message({
      components: [
        component.container({
          components: [
            component.section({
              content: [
                `## Your Free Loader Script`,
                `Copy and paste this script into your executor:`,
                ``,
                `\`\`\`lua`,
                loader_script,
                `\`\`\``,
                ``,
                `-# You have been whitelisted and received the script role!`,
              ],
              thumbnail : format.logo_url,
            }),
            component.action_row(
              component.secondary_button("Mobile Copy", "free_mobile_copy"),
            ),
          ],
        }),
      ],
    })

    await api.edit_deferred_reply(interaction, message)
  } catch (error) {
    __log.error("Failed to process free script:", error)

    await api.edit_deferred_reply(interaction, create_rate_limit_message("Free Script"))
  }
}

export async function handle_free_mobile_copy(interaction: ButtonInteraction): Promise<void> {
  const member = interaction.member as GuildMember

  await interaction.deferReply({ ephemeral: true })

  const user = member.user

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
              "### 📹 Video Tutorials:",
            ]),
            component.media_gallery([
              component.gallery_item(
                "https://cdn.discordapp.com/attachments/1338440449249116232/1474113355558948864/ScreenRecording_02-20-2026_01-38-53_1.mov",
                "📱 Mobile Tutorial",
              ),
              component.gallery_item(
                "https://cdn.discordapp.com/attachments/1338440449249116232/1474113426224844911/2026-02-20_01-36-58.mp4",
                "🖥️ Desktop Tutorial",
              ),
            ]),
          ],
        }),
      ],
    }))
    return
  }

  try {
    const check_url = `https://api.luarmor.net/v3/projects/${FREE_PROJECT_ID}/users?discord_id=${member.id}`
    const check_res = await http.get<any>(check_url, get_headers())

    let user_key: string | null = null

    if (check_res.users && Array.isArray(check_res.users) && check_res.users.length > 0) {
      user_key = check_res.users[0].user_key
    } else if (check_res.user_key) {
      user_key = check_res.user_key
    } else if (Array.isArray(check_res) && check_res.length > 0) {
      user_key = check_res[0].user_key
    }

    if (!user_key) {
      await interaction.editReply({
        content : "You don't have access to the free script. Click \"Get Script\" first.",
      })
      return
    }

    const loader_script = [
      `script_key="${user_key}"`,
      `loadstring(game:HttpGet("https://raw.githubusercontent.com/unkronnn/EnvyScript/main/FreeLoader.lua"))()`,
    ].join("\n")

    const mobile_copy = loader_script.replace(/\n/g, " ")

    await interaction.editReply({
      content : `\`${mobile_copy}\``,
    })
  } catch (error) {
    __log.error("Failed to get mobile copy:", error)

    await interaction.editReply({
      content : "Failed to retrieve your script. Please try again later.",
    })
  }
}

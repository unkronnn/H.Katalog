import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
}                      from "discord.js"
import { Command }     from "@shared/types/command"
import { component }   from "@shared/utils"
import { setup_server_permissions } from "./setup_server_controller"

export const data = new SlashCommandBuilder()
  .setName("setup-server")
  .setDescription("Automatically configure server channel permissions")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    await interaction.deferReply({ ephemeral: true })

    const result = await setup_server_permissions(interaction.guild!)

    if (!result.success) {
      const error_message = component.build_message({
        components: [
          component.container({
            components: [
              component.text([
                `## Setup Failed`,
                result.error,
              ]),
            ],
          }),
        ],
      })

      await interaction.editReply(error_message)
      return
    }

    const success_message = component.build_message({
      components: [
        component.container({
          components: [
            component.text([
              `## Server Setup Complete`,
              ``,
              `Permissions have been configured successfully!`,
              ``,
              `### Summary:`,
              `- @everyone: Can only see verify, welcome, booster, terms`,
              `- Verified: Can see channels and chat in designated areas`,
              `- Booster: Full access to booster channels`,
              ``,
              `### Channels Updated: ${result.channels_updated}`,
              `### Roles Created: ${result.roles_created}`,
              ``,
              `Server is now ready for new members!`,
            ]),
          ],
        }),
      ],
    })

    await interaction.editReply(success_message)
  } catch (error) {
    console.error("[ - SETUP SERVER - ] Error:", error)
    await interaction.editReply({
      content: "An error occurred while setting up server permissions.",
    })
  }
}

export const command = {
  data,
  execute,
}

export default {
  data,
  execute,
}

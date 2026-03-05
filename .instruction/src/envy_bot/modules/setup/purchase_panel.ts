import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  TextChannel,
  GuildMember,
} from "discord.js"
import { Command } from "@shared/types/command"
import { is_admin } from "@shared/database/settings/permissions"
import { component, api } from "@shared/utils"
import { get_ticket_config } from "@shared/database/unified_ticket"

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("purchase_panel")
    .setDescription("Send the purchase ticket panel") as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    if (!is_admin(interaction.member as GuildMember)) {
      await interaction.reply({
        content: "You don't have permission to use this command.",
        flags: 64,
      })
      return
    }

    await interaction.deferReply({ flags: 64 })

    const config = get_ticket_config("purchase")
    if (!config) {
      await interaction.editReply({ content: "Purchase ticket config not found." })
      return
    }

    let channel: TextChannel | null = null
    try {
      channel = await interaction.client.channels.fetch(config.panel_channel_id) as TextChannel
    } catch {
      channel = null
    }

    if (!channel) {
      await interaction.editReply({
        content: `Panel channel not found. ID: ${config.panel_channel_id}`,
      })
      return
    }

    const message = component.build_message({
      components: [
        component.container({
          components: [
            component.text([
              "## Purchase Ticket",
              "If you have questions about the script please use <#1473743673081466940> to ask our staffs.",
              "",
              "You can only create a ticket to purchase a script. Opening a ticket without making a purchase will be considered intentional trolling and a warning will be given.",
              "",
              "Our script price is stated in <#1473732158333124640>",
            ]),
            component.divider(),
            component.section({
              content: [
                "## Payment Method:",
                "<:Qris:1473744169699774595> - QRIS ( Quick Response Code Indonesian Standard )",
                "<:briiii:1473744391909806283> - BRI",
                "<:FS_Gopay:1473744165593419877> - Gopay",
                "<:FS_Dana:1473744163823423751> - Dana",
                "<:ovo:1473744167371804742> - Ovo",
              ],
              thumbnail: "https://media.discordapp.net/attachments/1473557530688098354/1474078852400808120/Black.jpg?ex=6997526a&is=699600ea&hm=fb9b06086d7cf62ad5ecee71f40197661194958911f0bae02b6c00b9dcf0b6a6&=&format=webp&quality=lossless&width=482&height=296",
            }),
            component.divider(),
            component.action_row(
              component.secondary_button("Open", "purchase_open", component.emoji_object("ticket", "1411878131366891580"))
            ),
          ],
        }),
      ],
    })

    await api.send_components_v2(channel.id, api.get_token(), message)

    await interaction.editReply({
      content: "Purchase panel sent!",
    })
  },
}

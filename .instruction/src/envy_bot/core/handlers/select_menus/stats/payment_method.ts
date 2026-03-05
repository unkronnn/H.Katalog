import { StringSelectMenuInteraction } from "discord.js"
import { component, api } from "@shared/utils"
import { get_ticket } from "@shared/database/unified_ticket"

// - PAYMENT DETAIL INTERFACES - \\
interface payment_detail {
  title: string
  content: string[]
  image?: string
}

// - NORMAL TICKET PAYMENT DETAILS - \\
const payment_details: Record<string, payment_detail> = {
  qris: {
    title   : "QRIS Payment",
    content : [
      `### <:Qris:1473744169699774595> QRIS`,
      ``,
      `Scan the QR code below to pay instantly.`,
      ``,
      `> **Supported:** All banks, e-wallets (Dana, GoPay, OVO, ShopeePay, etc.)`,
    ],
    image   : "https://media.discordapp.net/attachments/1473557530688098354/1473746957385334785/image.png?ex=6997554f&is=699603cf&hm=f460cc2466ccd0d22f912d6ddcf4a1dfd864b7c49ca2c2648166565ae3840531&=&format=webp&quality=lossless&width=496&height=700",
  },
  dana: {
    title   : "Dana Payment",
    content : [
      `### <:Dana:1473744163823423751> Dana`,
      ``,
      `**Phone:** \`0895418425934\``,
      `**Name:** Syukron Maulana`,
      ``,
      `> Transfer to the number above and send screenshot as proof.`,
    ],
  },
  gopay: {
    title   : "GoPay Payment",
    content : [
      `### <:FS_Gopay:1473744165593419877> GoPay`,
      ``,
      `**Phone:** \`085701678313\``,
      `**Name:** Syukron Maulana`,
      ``,
      `> Transfer to the number above and send screenshot as proof.`,
    ],
  },
  brii: {
    title   : "Bank Rakyat Indonesia (BRI) Payment",
    content : [
      `### <:briiii:1473744391909806283> BRI`,
      ``,
      `**Account Number:** \`817201005576534\``,
      `**Name:** Syukron Maulana`,
      ``,
      `> Send as **Friends & Family** to avoid fees.`,
      `> Send screenshot as proof after payment.`,
    ],
  },
}

// - MIDDLEMAN TICKET PAYMENT DETAILS - \\
const middleman_payment_details: Record<string, payment_detail> = {
  qris: {
    title   : "QRIS Payment",
    content : [
      `### <:qris:1251913366713139303> QRIS`,
      ``,
      `Scan the QR code below to pay instantly.`,
      ``,
      `> **Supported:** All banks, e-wallets (Dana, GoPay, OVO, ShopeePay, etc.)`,
    ],
    image   : "https://raw.githubusercontent.com/bimoraa/envy_bot/main/assets/images/qris_lendow.png",
  },
  dana: {
    title   : "Dana/OVO/GoPay Payment",
    content : [
      `### <:Dana:1473744163823423751> Dana / <:GoPay:1473744165593419877> GoPay / <:OVO:1473744167371804742> OVO`,
      ``,
      `**Phone:** \`085763794032\``,
      `**Name:** Daniel Yedija Laowo`,
      ``,
      `> Transfer to the number above and send screenshot as proof.`,
    ],
  },
  bank_jago: {
    title   : "Bank Jago Payment",
    content : [
      `### Bank Jago`,
      ``,
      `**Account Number:** \`107329884762\``,
      `**Name:** Daniel Yedija Laowo`,
      ``,
      `> Transfer to the account above and send screenshot as proof.`,
    ],
  },
  seabank: {
    title   : "Seabank Payment",
    content : [
      `### Seabank`,
      ``,
      `**Account Number:** \`901996695987\``,
      `**Name:** Daniel Yedija Laowo`,
      ``,
      `> Transfer to the account above and send screenshot as proof.`,
    ],
  },
  bri: {
    title   : "BRI Payment",
    content : [
      `### Bank BRI`,
      ``,
      `**Account Number:** \`817201005576534\``,
      `**Name:** Daniel Yedija Laowo`,
      ``,
      `> Transfer to the account above and send screenshot as proof.`,
    ],
  },
}

/**
 * @description Handles payment method selection for tickets
 * @param {StringSelectMenuInteraction} interaction - The select menu interaction
 * @returns {Promise<void>}
 */
export async function handle_payment_method_select(interaction: StringSelectMenuInteraction): Promise<void> {
  const selected = interaction.values[0]
  
  // - CHECK IF MIDDLEMAN TICKET FROM TICKET DATA - \\
  const thread_id    = interaction.channel?.id
  const ticket_data  = thread_id ? get_ticket(thread_id) : undefined
  const is_middleman = ticket_data?.ticket_type === "middleman"
  const details      = is_middleman ? middleman_payment_details[selected] : payment_details[selected]

  if (!details) {
    await interaction.reply({
      content : "Payment method not found.",
      flags   : 64,
    })
    return
  }

  await interaction.deferReply({ flags: 32832 } as any)

  // - BUILD MESSAGE USING COMPONENT UTILS - \\
  const message_components = details.image
    ? [
        component.text(details.content),
        component.divider(2),
        component.media_gallery([{ media: { url: details.image } }]),
      ]
    : [
        component.text(details.content),
      ]

  const message = component.build_message({
    components : [
      component.container({
        components : message_components,
      }),
    ],
  })
  
  await api.edit_interaction_response(
    interaction.client.user!.id,
    interaction.token,
    message
  )
}

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  EmbedBuilder
}                                   from 'discord.js';

// - COMPONENT V2 BUILDERS - \\

/**
 * Create embed with Component V2 format
 * @param title string
 * @param description string
 * @param color number
 * @param fields Array<{name: string, value: string, inline: boolean}>
 * @return EmbedBuilder
 */
const create_embed_v2 = (
  title      : string,
  description: string,
  color      : number,
  fields?    : Array<{ name: string; value: string; inline: boolean }>
): EmbedBuilder => {
  const embed                   = new EmbedBuilder();

  embed.setColor(color);
  embed.setTitle(title);
  embed.setDescription(description);

  if (fields && fields.length > 0) {
    embed.addFields(fields);
  }

  embed.setTimestamp();

  return embed;
};

/**
 * Create select menu component with Component V2 format
 * @param custom_id string
 * @param placeholder string
 * @param options Array<{label: string, value: string, description: string, emoji?: string}>
 * @return ActionRowBuilder<StringSelectMenuBuilder>
 */
const create_select_menu_v2 = (
  custom_id  : string,
  placeholder: string,
  options    : Array<{
    label      : string;
    value      : string;
    description: string;
    emoji?     : string;
  }>
): ActionRowBuilder<StringSelectMenuBuilder> => {
  const select_menu             = new StringSelectMenuBuilder();

  select_menu.setCustomId(custom_id);
  select_menu.setPlaceholder(placeholder);
  select_menu.addOptions(options);

  const row                     = new ActionRowBuilder<StringSelectMenuBuilder>();
  row.addComponents(select_menu);

  return row;
};

/**
 * Create button component with Component V2 format
 * @param label string
 * @param style ButtonStyle
 * @param url string
 * @param emoji string
 * @return ActionRowBuilder<ButtonBuilder>
 */
const create_button_v2 = (
  label : string,
  style : ButtonStyle,
  url   : string,
  emoji?: string
): ActionRowBuilder<ButtonBuilder> => {
  const button                  = new ButtonBuilder();

  button.setLabel(label);
  button.setStyle(style);
  button.setURL(url);

  if (emoji) {
    button.setEmoji(emoji);
  }

  const row                     = new ActionRowBuilder<ButtonBuilder>();
  row.addComponents(button);

  return row;
};

// - EXPORTS - \\

export {
  create_embed_v2,
  create_select_menu_v2,
  create_button_v2
};

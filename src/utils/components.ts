// - Discord component v2 builder utilities - \\

export enum component_type {
  action_row = 1,
  button = 2,
  string_select = 3,
  text_input = 4,
  user_select = 5,
  role_select = 6,
  mentionable_select = 7,
  channel_select = 8,
  section = 9,
  text = 10,
  thumbnail = 11,
  media_gallery = 12,
  file = 13,
  divider = 14,
  separator = 14,
  content_inventory_entry = 16,
  container = 17,
}

export enum button_style {
  primary = 1,
  secondary = 2,
  success = 3,
  danger = 4,
  link = 5,
}

export interface button_component {
  type        : number;
  style       : number;
  label       : string;
  custom_id?  : string;
  url?        : string;
  emoji?      : { id?: string; name: string };
  disabled?   : boolean;
}

export interface action_row_component {
  type       : number;
  components : button_component[] | select_menu_component[];
}

export interface select_option {
  label      : string;
  value      : string;
  description?: string;
  emoji?     : { id?: string; name: string };
  default?   : boolean;
}

export interface select_menu_component {
  type       : number;
  custom_id  : string;
  placeholder?: string;
  options?   : select_option[];
  min_values?: number;
  max_values?: number;
}

export interface thumbnail_component {
  type : number;
  media: { url: string };
}

export interface text_component {
  type   : number;
  content: string;
}

export interface section_component {
  type      : number;
  components: text_component[];
  accessory?: thumbnail_component | button_component;
}

export interface divider_component {
  type    : number;
  spacing?: number;
  divider?: boolean;
}

export interface container_component {
  type        : number;
  components  : (section_component | text_component | divider_component | action_row_component)[];
  accent_color?: number | { r: number; g: number; b: number } | null;
  spoiler?    : boolean;
}

export interface message_payload {
  flags?     : number;
  content?   : string;
  components: (container_component | text_component | file_component)[];
}

export interface file_component {
  type: number;
  file: { url: string };
}

// - COMPONENT BUILDERS - \\

/**
 * Create primary button component
 * @param label string
 * @param custom_id string
 * @param emoji object
 * @param disabled boolean
 * @return button_component
 */
export function primary_button(
  label     : string,
  custom_id : string,
  emoji?    : { id?: string; name: string },
  disabled? : boolean
): button_component {
  return {
    type     : component_type.button,
    style    : button_style.primary,
    label,
    custom_id,
    emoji,
    disabled,
  };
}

/**
 * Create secondary button component
 * @param label string
 * @param custom_id string
 * @param emoji object
 * @param disabled boolean
 * @return button_component
 */
export function secondary_button(
  label     : string,
  custom_id : string,
  emoji?    : { id?: string; name: string },
  disabled? : boolean
): button_component {
  return {
    type     : component_type.button,
    style    : button_style.secondary,
    label,
    custom_id,
    emoji,
    disabled,
  };
}

/**
 * Create success button component
 * @param label string
 * @param custom_id string
 * @param emoji object
 * @param disabled boolean
 * @return button_component
 */
export function success_button(
  label     : string,
  custom_id : string,
  emoji?    : { id?: string; name: string },
  disabled? : boolean
): button_component {
  return {
    type     : component_type.button,
    style    : button_style.success,
    label,
    custom_id,
    emoji,
    disabled,
  };
}

/**
 * Create danger button component
 * @param label string
 * @param custom_id string
 * @param emoji object
 * @param disabled boolean
 * @return button_component
 */
export function danger_button(
  label     : string,
  custom_id : string,
  emoji?    : { id?: string; name: string },
  disabled? : boolean
): button_component {
  return {
    type     : component_type.button,
    style    : button_style.danger,
    label,
    custom_id,
    emoji,
    disabled,
  };
}

/**
 * Create link button component
 * @param label string
 * @param url string
 * @param emoji object
 * @param disabled boolean
 * @return button_component
 */
export function link_button(
  label     : string,
  url       : string,
  emoji?    : { id?: string; name: string },
  disabled? : boolean
): button_component {
  return {
    type     : component_type.button,
  style    : button_style.link,
  label,
  url,
  emoji,
  disabled,
  };
}

/**
 * Create action row component
 * @param components button_component[]
 * @return action_row_component
 */
export function action_row(...components: button_component[]): action_row_component {
  return {
    type     : component_type.action_row,
    components,
  };
}

/**
 * Create select menu component
 * @param custom_id string
 * @param placeholder string
 * @param options select_option[]
 * @return action_row_component
 */
export function select_menu(
  custom_id  : string,
  placeholder: string,
  options    : select_option[]
): action_row_component {
  return {
    type: component_type.action_row,
    components: [
      {
        type       : component_type.string_select,
        custom_id,
        placeholder,
        options,
      },
    ],
  };
}

/**
 * Create thumbnail component
 * @param url string
 * @return thumbnail_component
 */
export function thumbnail(url: string): thumbnail_component {
  return {
    type : component_type.thumbnail,
    media: { url },
  };
}

/**
 * Create text component
 * @param content string | string[]
 * @return text_component
 */
export function text(content: string | string[]): text_component {
  return {
    type   : component_type.text,
    content: Array.isArray(content) ? content.join('\n') : content,
  };
}

/**
 * Create section component
 * @param options object
 * @return section_component
 */
export function section(options: {
  content   : string | string[];
  thumbnail?: string;
  media?    : string;
  accessory?: thumbnail_component | button_component;
}): section_component {
  const result: section_component = {
    type      : component_type.section,
    components: [text(options.content)],
  };

  // - HANDLE EXPLICIT ACCESSORY (BUTTON OR MEDIA) - \\
  if (options.accessory) {
    if (
      (options.accessory.type === component_type.thumbnail && (options.accessory as any).media?.url) ||
      (options.accessory.type === component_type.button)
    ) {
      result.accessory = options.accessory;
    }
  }
  // - FALLBACK TO MEDIA/THUMBNAIL - \\
  else {
    const media_url = options.media || options.thumbnail;

    if (media_url && typeof media_url === 'string' && media_url.trim().length > 0 && media_url.startsWith('http')) {
      result.accessory = thumbnail(media_url);
    }
  }

  return result;
}

/**
 * Create divider component
 * @param spacing number
 * @return divider_component
 */
export function divider(spacing?: number): divider_component {
  const result: divider_component = {
    type: component_type.divider,
  };

  if (spacing !== undefined) {
    result.spacing = spacing;
  }

  return result;
}

/**
 * Create separator component (alias for divider)
 * @param spacing number
 * @return divider_component
 */
export function separator(spacing?: number): divider_component {
  return divider(spacing);
}

/**
 * Create container component
 * @param options object
 * @return container_component
 */
export function container(options: {
  components     : (section_component | text_component | divider_component | action_row_component)[];
  accent_color?  : number | { r: number; g: number; b: number } | null;
  spoiler?       : boolean;
}): container_component {
  let processed_color = options.accent_color;

  if (
    options.accent_color &&
    typeof options.accent_color === 'object' &&
    'r' in options.accent_color &&
    'g' in options.accent_color &&
    'b' in options.accent_color
  ) {
    processed_color = (options.accent_color.r << 16) | (options.accent_color.g << 8) | options.accent_color.b;
  }

  return {
    type        : component_type.container,
    components  : options.components,
    accent_color: processed_color as number | null | undefined,
    spoiler     : options.spoiler,
  };
}

/**
 * Build message payload with suppress embeds flag
 * @param options object
 * @return message_payload
 */
export function build_message(options: {
  components: (container_component | text_component)[];
  content?  : string;
}): message_payload {
  return {
    flags     : 64, // SUPPRESS_EMBEDS - This is the key!
    content   : options.content,
    components: options.components,
  };
}

/**
 * Create emoji object
 * @param name string
 * @param id string
 * @return object
 */
export function emoji_object(name: string, id?: string): { id?: string; name: string } {
  return id ? { id, name } : { name };
}

/**
 * Create file component
 * @param url string
 * @return file_component
 */
export function file(url: string): file_component {
  return {
    type: component_type.file,
    file: { url },
  };
}

// - EXPORT TYPES - \\

export type {
  button_component,
  action_row_component,
  select_option,
  select_menu_component,
  thumbnail_component,
  text_component,
  section_component,
  divider_component,
  container_component,
  message_payload,
  file_component
};

// - LEGACY FUNCTIONS (Backward compatibility) - \\

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  EmbedBuilder,
} from 'discord.js';

/**
 * Create embed with Component V2 format (LEGACY)
 */
export function create_embed_v2(
  title      : string,
  description: string,
  color      : number | null,
  fields?    : Array<{ name: string; value: string; inline: boolean }>
): EmbedBuilder {
  const embed = new EmbedBuilder();

  if (color !== null) {
    embed.setColor(color);
  }

  embed.setTitle(title);
  embed.setDescription(description);

  if (fields && fields.length > 0) {
    embed.addFields(fields);
  }

  embed.setTimestamp();

  return embed;
}

/**
 * Create select menu component with Component V2 format (LEGACY)
 */
export function create_select_menu_v2(
  custom_id  : string,
  placeholder: string,
  options    : Array<{
    label      : string;
    value      : string;
    description: string;
    emoji?     : string;
  }>
): ActionRowBuilder<StringSelectMenuBuilder> {
  const select_menu = new StringSelectMenuBuilder();

  select_menu.setCustomId(custom_id);
  select_menu.setPlaceholder(placeholder);
  select_menu.addOptions(options);

  const row = new ActionRowBuilder<StringSelectMenuBuilder>();
  row.addComponents(select_menu);

  return row;
}

/**
 * Create button component with Component V2 format (LEGACY)
 */
export function create_button_v2(
  label : string,
  style : ButtonStyle,
  url   : string,
  emoji?: string
): ActionRowBuilder<ButtonBuilder> {
  const button = new ButtonBuilder();

  button.setLabel(label);
  button.setStyle(style);
  button.setURL(url);

  if (emoji) {
    button.setEmoji(emoji);
  }

  const row = new ActionRowBuilder<ButtonBuilder>();
  row.addComponents(button);

  return row;
}

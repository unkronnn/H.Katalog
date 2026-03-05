import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  EmbedBuilder,
  APIEmbed
}                                   from 'discord.js';

// - COMPONENT INTERFACES - \\

interface container_component {
  components : any[];
}

interface text_component {
  content : string | string[];
}

interface divider_component {
  lines : number;
}

interface section_component {
  content   : string[];
  thumbnail?: string;
}

interface action_row_component {
  components : any[];
}

interface select_menu_component {
  custom_id  : string;
  placeholder: string;
  options    : Array<{
    label      : string;
    value      : string;
    description?: string;
    emoji?      : string;
  }>;
}

interface button_component {
  label : string;
  id    ?: string;
  url   ?: string;
  style ?: 'primary' | 'secondary' | 'success' | 'danger' | 'link';
}

interface message_components {
  components: container_component[];
}

// - COMPONENT BUILDERS - \\

/**
 * Create container component
 * @param config container_component
 * @return container_component
 */
const container = (config: container_component): container_component => {
  return config;
};

/**
 * Create text component
 * @param content string | string[]
 * @return text_component
 */
const text = (content: string | string[]): text_component => {
  return {
    content: content
  };
};

/**
 * Create divider component
 * @param lines number
 * @return divider_component
 */
const divider = (lines: number = 1): divider_component => {
  return {
    lines: lines
  };
};

/**
 * Create section component
 * @param content string[]
 * @param thumbnail string
 * @return section_component
 */
const section = (content: string[], thumbnail?: string): section_component => {
  return {
    content  : content,
    thumbnail: thumbnail
  };
};

/**
 * Create primary button component
 * @param label string
 * @param id string
 * @return button_component
 */
const primary_button = (label: string, id: string): button_component => {
  return {
    label: label,
    style : 'primary',
    id    : id
  };
};

/**
 * Create secondary button component
 * @param label string
 * @param id string
 * @return button_component
 */
const secondary_button = (label: string, id: string): button_component => {
  return {
    label: label,
    style : 'secondary',
    id    : id
  };
};

/**
 * Create success button component
 * @param label string
 * @param id string
 * @return button_component
 */
const success_button = (label: string, id: string): button_component => {
  return {
    label: label,
    style : 'success',
    id    : id
  };
};

/**
 * Create danger button component
 * @param label string
 * @param id string
 * @return button_component
 */
const danger_button = (label: string, id: string): button_component => {
  return {
    label: label,
    style : 'danger',
    id    : id
  };
};

/**
 * Create link button component
 * @param label string
 * @param url string
 * @return button_component
 */
const link_button = (label: string, url: string): button_component => {
  return {
    label: label,
    style : 'link',
    url   : url
  };
};

/**
 * Create select menu component
 * @param custom_id string
 * @param placeholder string
 * @param options Array<{label: string, value: string, description?: string, emoji?: string}>
 * @return select_menu_component
 */
const select_menu = (
  custom_id  : string,
  placeholder: string,
  options    : Array<{
    label      : string;
    value      : string;
    description?: string;
    emoji?      : string;
  }>
): select_menu_component => {
  return {
    custom_id  : custom_id,
    placeholder: placeholder,
    options    : options
  };
};

/**
 * Create action row component
 * @param components any[]
 * @return action_row_component
 */
const action_row = (...components: any[]): action_row_component => {
  return {
    components: components
  };
};

/**
 * Build message from components
 * @param config message_components
 * @return message_components
 */
const build_message = (config: message_components): message_components => {
  return config;
};

/**
 * Process container component to Discord format
 * @param container container_component
 * @return { embed: APIEmbed, components: any[] }
 */
const process_container = (container: container_component): {
  embed     : APIEmbed;
  components: any[];
} => {
  const embed        : any  = {};
  const discord_components: any[] = [];
  const parts        : string[] = [];

  for (const item of container.components) {
    // - HANDLE TEXT COMPONENT - \\

    if ('content' in item) {
      const content = (item as text_component).content;

      if (content) {
        if (Array.isArray(content)) {
          parts.push(...content);
        } else if (content.trim() !== '') {
          parts.push(content);
        }
      }
    }

    // - HANDLE DIVIDER COMPONENT - \\

    else if ('lines' in item) {
      const lines = (item as divider_component).lines;
      for (let i = 0; i < lines; i++) {
        parts.push('');
      }
    }

    // - HANDLE SECTION COMPONENT - \\

    else if ('content' in item && 'thumbnail' in item) {
      const section       = item as section_component;

      if (section.content && section.content.length > 0) {
        parts.push(...section.content);
      }

      if (section.thumbnail) {
        embed.thumbnail = { url: section.thumbnail };
      }
    }

    // - HANDLE ACTION ROW COMPONENT - \\

    else if ('components' in item && Array.isArray((item as action_row_component).components)) {
      const action_row_config = item as action_row_component;
      const discord_component = build_action_row_from_config(action_row_config);

      if (discord_component) {
        discord_components.push(discord_component);
      }
    }
  }

  // - BUILD EMBED DESCRIPTION - \\

  const description = parts.join('\n').trim();

  if (!description || description === '') {
    embed.description = ' ';
  } else {
    embed.description = description;
  }

  embed.timestamp = new Date().toISOString();

  return {
    embed     : embed,
    components: discord_components
  };
};

/**
 * Build Discord action row from action_row config
 * @param config action_row_component
 * @return ActionRowBuilder<any> | null
 */
const build_action_row_from_config = (config: action_row_component): ActionRowBuilder<any> | null => {
  const row = new ActionRowBuilder<any>();

  for (const component_config of config.components) {
    // - HANDLE BUTTON COMPONENT - \\

    if ('label' in component_config && ('id' in component_config || 'url' in component_config)) {
      const button_config = component_config as button_component;
      const button        = new ButtonBuilder();

      button.setLabel(button_config.label);

      const style_map: Record<string, ButtonStyle> = {
        primary  : ButtonStyle.Primary,
        secondary: ButtonStyle.Secondary,
        success  : ButtonStyle.Success,
        danger   : ButtonStyle.Danger,
        link     : ButtonStyle.Link
      };

      button.setStyle(style_map[button_config.style || 'secondary']);

      if (button_config.id) {
        button.setCustomId(button_config.id);
      }

      if (button_config.url) {
        button.setURL(button_config.url);
      }

      row.addComponents(button);
    }

    // - HANDLE SELECT MENU COMPONENT - \\

    else if ('custom_id' in component_config && 'options' in component_config) {
      const select_config = component_config as select_menu_component;
      const select        = new StringSelectMenuBuilder();

      select.setCustomId(select_config.custom_id);
      select.setPlaceholder(select_config.placeholder);

      select.addOptions(
        select_config.options.map((opt) => ({
          label     : opt.label,
          value     : opt.value,
          description: opt.description || undefined,
          emoji     : opt.emoji || undefined
        }))
      );

      row.addComponents(select);
    }
  }

  return row;
};

// - CONVERT TO DISCORD FORMAT - \\

/**
 * Convert message components to Discord format
 * @param message message_components
 * @return { embeds: APIEmbed[], components: any[] }
 */
const convert_to_discord_format = (message: message_components): {
  embeds    : APIEmbed[];
  components: any[];
} => {
  const embeds        : APIEmbed[] = [];
  const discord_components: any[] = [];

  for (const container_config of message.components) {
    const result = process_container(container_config);

    if (result.embed) {
      embeds.push(result.embed);
    }

    if (result.components) {
      discord_components.push(...result.components);
    }
  }

  return {
    embeds    : embeds,
    components: discord_components
  };
};

// - LEGACY FUNCTIONS (Kept for backward compatibility) - \\

/**
 * Create embed with Component V2 format
 * @param title string
 * @param description string
 * @param color number | null
 * @param fields Array<{name: string, value: string, inline: boolean}>
 * @return EmbedBuilder
 */
const create_embed_v2 = (
  title      : string,
  description: string,
  color      : number | null,
  fields?    : Array<{ name: string; value: string; inline: boolean }>
): EmbedBuilder => {
  const embed                   = new EmbedBuilder();

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
  container,
  text,
  divider,
  section,
  primary_button,
  secondary_button,
  success_button,
  danger_button,
  link_button,
  select_menu,
  action_row,
  build_message,
  convert_to_discord_format,
  create_embed_v2,
  create_select_menu_v2,
  create_button_v2
};

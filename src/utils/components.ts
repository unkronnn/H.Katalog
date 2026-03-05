import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  EmbedBuilder,
  APIEmbed
}                                   from 'discord.js';

// - COMPONENT INTERFACES - \\

interface component_container {
  type       : 'container';
  components : any[];
}

interface component_text {
  type : 'text';
  text : string | string[];
}

interface component_divider {
  type: 'divider';
}

interface component_section {
  type     : 'section';
  content  : string[];
  thumbnail?: string;
}

interface component_action_row {
  type : 'action_row';
  component: any;
}

interface component_button {
  type : 'button';
  label: string;
  style: 'primary' | 'secondary' | 'success' | 'danger' | 'link';
  id?  : string;
  url? : string;
  emoji?: string;
}

interface component_select_menu {
  type       : 'select_menu';
  custom_id  : string;
  placeholder: string;
  options    : Array<{
    label      : string;
    value      : string;
    description?: string;
    emoji?      : string;
  }>;
}

interface message_components {
  embeds    : APIEmbed[];
  components: any[];
}

// - COMPONENT BUILDERS - \\

/**
 * Create container component
 * @param components any[]
 * @return component_container
 */
const container = (...components: any[]): component_container => {
  return {
    type       : 'container',
    components : components
  };
};

/**
 * Create text component
 * @param content string | string[]
 * @return component_text
 */
const text = (content: string | string[]): component_text => {
  return {
    type: 'text',
    text: content
  };
};

/**
 * Create divider component
 * @return component_divider
 */
const divider = (): component_divider => {
  return {
    type: 'divider'
  };
};

/**
 * Create section component
 * @param content string[]
 * @param thumbnail string
 * @return component_section
 */
const section = (content: string[], thumbnail?: string): component_section => {
  return {
    type     : 'section',
    content  : content,
    thumbnail: thumbnail
  };
};

/**
 * Create action row component
 * @param component any
 * @return component_action_row
 */
const action_row = (component: any): component_action_row => {
  return {
    type     : 'action_row',
    component: component
  };
};

/**
 * Create primary button component
 * @param label string
 * @param custom_id string
 * @return component_button
 */
const primary_button = (label: string, custom_id: string): component_button => {
  return {
    type     : 'button',
    label    : label,
    style    : 'primary',
    id       : custom_id
  };
};

/**
 * Create secondary button component
 * @param label string
 * @param custom_id string
 * @return component_button
 */
const secondary_button = (label: string, custom_id: string): component_button => {
  return {
    type     : 'button',
    label    : label,
    style    : 'secondary',
    id       : custom_id
  };
};

/**
 * Create success button component
 * @param label string
 * @param custom_id string
 * @return component_button
 */
const success_button = (label: string, custom_id: string): component_button => {
  return {
    type     : 'button',
    label    : label,
    style    : 'success',
    id       : custom_id
  };
};

/**
 * Create danger button component
 * @param label string
 * @param custom_id string
 * @return component_button
 */
const danger_button = (label: string, custom_id: string): component_button => {
  return {
    type     : 'button',
    label    : label,
    style    : 'danger',
    id       : custom_id
  };
};

/**
 * Create link button component
 * @param label string
 * @param url string
 * @param emoji string
 * @return component_button
 */
const link_button = (label: string, url: string, emoji?: string): component_button => {
  return {
    type     : 'button',
    label    : label,
    style    : 'link',
    url      : url,
    emoji    : emoji
  };
};

/**
 * Create select menu component
 * @param custom_id string
 * @param placeholder string
 * @param options Array<{label: string, value: string, description?: string, emoji?: string}>
 * @return component_select_menu
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
): component_select_menu => {
  return {
    type       : 'select_menu',
    custom_id  : custom_id,
    placeholder: placeholder,
    options    : options
  };
};

/**
 * Build message from components
 * @param components any[]
 * @return message_components
 */
const build_message = (components: any[]): message_components => {
  const embeds      : APIEmbed[] = [];
  const discord_components: any[] = [];

  for (const component of components) {
    if (component.type === 'container') {
      const result = process_container(component);
      if (result.embed) embeds.push(result.embed);
      if (result.components) discord_components.push(...result.components);
    }
  }

  return {
    embeds    : embeds,
    components: discord_components
  };
};

/**
 * Process container component
 * @param container component_container
 * @return { embed: APIEmbed, components: any[] }
 */
const process_container = (container: component_container): {
  embed     : APIEmbed;
  components: any[];
} => {
  const embed   : any  = {};
  const components: any[] = [];
  const parts   : string[] = [];

  for (const item of container.components) {
    if (item.type === 'text') {
      if (item.text) {
        // - HANDLE ARRAY OR STRING TEXT - \\

        if (Array.isArray(item.text)) {
          parts.push(...item.text);
        } else if (item.text.trim() !== '') {
          parts.push(item.text);
        }
      }
    } else if (item.type === 'divider') {
      parts.push('─────────────────');
    } else if (item.type === 'section') {
      // - HANDLE SECTION WITH THUMBNAIL - \\

      if (item.content && item.content.length > 0) {
        parts.push(...item.content);
      }
    } else if (item.type === 'action_row') {
      const discord_component = build_action_row(item.component);
      if (discord_component) {
        components.push(discord_component);
      }
    }
  }

  const description = parts.join('\n').trim();

  // - ENSURE DESCRIPTION IS NEVER EMPTY - \\

  if (!description || description === '') {
    embed.description = ' '; // Unicode space (em space) - required by Discord
  } else {
    embed.description = description;
  }

  embed.timestamp = new Date().toISOString();

  // - HANDLE THUMBNAIL FROM SECTIONS - \\

  for (const item of container.components) {
    if (item.type === 'section' && item.thumbnail) {
      embed.thumbnail = { url: item.thumbnail };
      break;
    }
  }

  return {
    embed     : embed,
    components: components
  };
};

/**
 * Build Discord action row from component
 * @param component any
 * @return ActionRowBuilder<any> | null
 */
const build_action_row = (component: any): ActionRowBuilder<any> | null => {
  if (component.type === 'button') {
    const button   = new ButtonBuilder();
    button.setLabel(component.label);

    const style_map: Record<string, ButtonStyle> = {
      primary  : ButtonStyle.Primary,
      secondary: ButtonStyle.Secondary,
      success  : ButtonStyle.Success,
      danger   : ButtonStyle.Danger,
      link     : ButtonStyle.Link
    };

    button.setStyle(style_map[component.style]);

    if (component.id) {
      button.setCustomId(component.id);
    }

    if (component.url) {
      button.setURL(component.url);
    }

    if (component.emoji) {
      button.setEmoji(component.emoji);
    }

    const row = new ActionRowBuilder<any>();
    row.addComponents(button);
    return row;
  }

  if (component.type === 'select_menu') {
    const select   = new StringSelectMenuBuilder();
    select.setCustomId(component.custom_id);
    select.setPlaceholder(component.placeholder);

    select.addOptions(
      component.options.map((opt: any) => ({
        label     : opt.label,
        value     : opt.value,
        description: opt.description || undefined,
        emoji     : opt.emoji || undefined
      }))
    );

    const row = new ActionRowBuilder<any>();
    row.addComponents(select);
    return row;
  }

  return null;
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
  action_row,
  primary_button,
  secondary_button,
  success_button,
  danger_button,
  link_button,
  select_menu,
  build_message,
  create_embed_v2,
  create_select_menu_v2,
  create_button_v2
};

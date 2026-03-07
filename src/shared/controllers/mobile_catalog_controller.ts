import {
  Interaction,
  StringSelectMenuInteraction,
  MessageFlags,
  EmbedBuilder,
  ComponentBuilder
} from 'discord.js';
import { log_error } from '../../utils/error_logger';
import {
  get_dummy_vendors_by_game,
  get_dummy_vendor_detail
} from '../../data/mobile_catalog_dummy_data';
import type { pricing_option } from '../../data/mobile_catalog_dummy_data';
import { component } from '../../utils';

// - GAME EMOJI MAPPINGS - \\

const __game_emoji_map    = {
  pubg_mobile         : '<:pubg:1478923070436806758>',
  mobile_legends      : '<:mlbb:1478923159758438511>',
  free_fire           : '<:ff:1478923235151183970>',
  valorant_mobile     : '<:valom:1478923497559560293>',
  delta_force_mobile  : '<:dfm:1478923509949530265>',
  blood_strike        : '<:bloodstrike:1478923684080259365>',
  cod_mobile          : '<:codm:1478923521072562358>',
  eight_ball_pool     : '<:8bp:1478923764485066832>',
  cross_fire          : '<:crossfire:1478924029976121364>',
  honor_of_kings      : '<:hok:1478924442381062174>',
  arena_of_valor      : '<:aovstorenew:1478924461888635053>'
};

// - PUBG MOBILE VENDOR EMOJI MAP - \\

const __pubg_vendor_emoji_map: { [key: string]: string } = {
  'TANTEDARA PLUGIN INDONESIA': '<:tantedara:1479381425961832500>',
  'KING Android'             : '<:kingandroid:1479381392843604106>',
  'SHIELD (Non Root)'        : '<:shield:1479381416054886531>',
  'KING iOS'                 : '<:kingios:1479381376523567154>',
  'OASIS iOS'                : '<:oasis:1479381403878690900>'
};

// - GAME DATA - \\

interface mobile_game {
  game_id       : string;
  game_name     : string;
  emoji         : string;
  description   : string;
  vendors_count : number;
}

const __mobile_games     : mobile_game[] = [
  {
    game_id      : 'pubg_mobile',
    game_name    : 'PUBG MOBILE',
    emoji        : __game_emoji_map.pubg_mobile,
    description  : 'Battle royale game terpopuler',
    vendors_count: 0
  },
  {
    game_id      : 'mobile_legends',
    game_name    : 'MOBILE LEGENDS',
    emoji        : __game_emoji_map.mobile_legends,
    description  : 'MOBA game terbaik di mobile',
    vendors_count: 0
  },
  {
    game_id      : 'free_fire',
    game_name    : 'FREE FIRE',
    emoji        : __game_emoji_map.free_fire,
    description  : 'Battle royale game cepat',
    vendors_count: 0
  },
  {
    game_id      : 'valorant_mobile',
    game_name    : 'VALORANT MOBILE',
    emoji        : __game_emoji_map.valorant_mobile,
    description  : 'Tactical FPS dari Riot Games',
    vendors_count: 0
  },
  {
    game_id      : 'delta_force_mobile',
    game_name    : 'DELTA FORCE MOBILE',
    emoji        : __game_emoji_map.delta_force_mobile,
    description  : 'Tactical shooter game',
    vendors_count: 0
  },
  {
    game_id      : 'blood_strike',
    game_name    : 'BLOOD STRIKE',
    emoji        : __game_emoji_map.blood_strike,
    description  : 'FPS action game',
    vendors_count: 0
  },
  {
    game_id      : 'cod_mobile',
    game_name    : 'CALL OF DUTY MOBILE',
    emoji        : __game_emoji_map.cod_mobile,
    description  : 'Action FPS terpopuler',
    vendors_count: 0
  },
  {
    game_id      : 'eight_ball_pool',
    game_name    : '8 BALL POOL',
    emoji        : __game_emoji_map.eight_ball_pool,
    description  : 'Billiard game classic',
    vendors_count: 0
  },
  {
    game_id      : 'cross_fire',
    game_name    : 'CROSS FIRE',
    emoji        : __game_emoji_map.cross_fire,
    description  : 'Tactical FPS legend',
    vendors_count: 0
  },
  {
    game_id      : 'honor_of_kings',
    game_name    : 'HONOR OF KINGS',
    emoji        : __game_emoji_map.honor_of_kings,
    description  : 'MOBA game dari Tencent',
    vendors_count: 0
  },
  {
    game_id      : 'arena_of_valor',
    game_name    : 'ARENA OF VALOR',
    emoji        : __game_emoji_map.arena_of_valor,
    description  : 'MOBA game epic',
    vendors_count: 0
  }
];

// - CONSTANTS - \\

const __max_display_items = 25;

// - HELPER FUNCTIONS - \\

/**
 * Parse custom emoji string to extract name and ID
 * @param emoji_string string - Format: <:name:id> or <a:name:id>
 * @return { id?: string; name: string } | null
 */
const parse_custom_emoji = (emoji_string: string): { id?: string; name: string } | null => {
  const match = emoji_string.match(/<(a)?:([^:]+):(\d+)>/);
  if (match) {
    return {
      id: match[3],
      name: match[2]
    };
  }
  // If not a custom emoji, return it as-is for unicode emojis
  return { name: emoji_string };
};

// - EMBED BUILDERS - \\

/**
 * Build mobile games catalog message (Traditional Discord.js)
 * @return Promise<{ embeds: EmbedBuilder[], components: ComponentBuilder[] }>
 */
const build_mobile_catalog_embed = async (): Promise<{ embeds: EmbedBuilder[], components: any[] }> => {
  try {
    const game_list_parts = __mobile_games.map((game) =>
      `${game.emoji} ${game.game_name}`
    ).join('\n');

    // - BUILD EMBED - \\

    const embed = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle('📱 Mobile Games Catalog')
      .setDescription(game_list_parts)
      .setTimestamp();

    // - BUILD SELECT OPTIONS - \\

    const select_options = __mobile_games.map((game) => {
      const parsed_emoji = parse_custom_emoji(game.emoji);
      return {
        label      : game.game_name,
        value      : game.game_id,
        description: game.description,
        emoji      : parsed_emoji || undefined
      };
    }).slice(0, __max_display_items);

    // - BUILD COMPONENT - \\

    const select_menu = component.create_select_menu_v2(
      'mobile_catalog_select_game',
      'Select a mobile game to view catalog',
      select_options
    );

    console.log('[ - MOBILE_CATALOG_CONTROLLER - ] Mobile catalog message built successfully');

    return {
      embeds: [embed],
      components: [select_menu]
    };
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Build vendor selection message for selected mobile game (Traditional Discord.js)
 * @param game_id string
 * @return Promise<{ embeds: EmbedBuilder[], components: any[] }>
 */
const build_mobile_vendor_selection_embed = async (game_id: string): Promise<{ embeds: EmbedBuilder[], components: any[] }> => {
  try {
    const selected_game = __mobile_games.find((game) => game.game_id === game_id);

    if (!selected_game) {
      throw new Error(`Game not found: ${game_id}`);
    }

    const vendors = get_dummy_vendors_by_game(game_id);

    // - BUILD VENDOR LIST - \\

    const vendor_list_parts = vendors.map((vendor) => {
      const emoji = __pubg_vendor_emoji_map[vendor.name] || '🧀';
      return `${emoji} ${vendor.name}`;
    }).join('\n');

    // - BUILD EMBED - \\

    const embed = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle(`${selected_game.emoji} ${selected_game.game_name} - Vendors`)
      .setDescription(vendor_list_parts)
      .setTimestamp();

    // - BUILD SELECT OPTIONS - \\

    const select_options = vendors.map((vendor) => {
      const parsed_emoji = parse_custom_emoji(__pubg_vendor_emoji_map[vendor.name] || '🧀');

      let description: string;

      if (vendor.pricing_options && vendor.pricing_options.length > 0) {
        const prices = vendor.pricing_options.map(opt => opt.price);
        const min_price = Math.min(...prices);
        const max_price = Math.max(...prices);
        description = min_price === max_price
          ? `Rp ${min_price.toLocaleString('id-ID')}`
          : `Rp ${min_price.toLocaleString('id-ID')} - Rp ${max_price.toLocaleString('id-ID')}`;
      } else if (vendor.price) {
        description = `Rp ${(vendor as any).price.toLocaleString('id-ID')}`;
      } else {
        description = 'Contact for pricing';
      }

      return {
        label     : vendor.name,
        value     : `${vendor.name}::${vendors.indexOf(vendor)}`,
        description,
        emoji     : parsed_emoji || undefined
      };
    });

    // - BUILD COMPONENT - \\

    const select_menu = component.create_select_menu_v2(
      `mobile_catalog_select_vendor:${game_id}`,
      'Select a vendor to view details',
      select_options.slice(0, __max_display_items)
    );

    console.log(`[ - MOBILE_CATALOG_CONTROLLER - ] Vendor selection message built for game: ${game_id}`);

    return {
      embeds: [embed],
      components: [select_menu]
    };
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Build vendor detail message with purchase button (Traditional Discord.js)
 * @param game_id string
 * @param vendor_value string
 * @return Promise<{ embeds: EmbedBuilder[], components: any[] }>
 */
const build_mobile_vendor_detail_embed = async (
  game_id      : string,
  vendor_value : string
): Promise<{ embeds: EmbedBuilder[], components: any[] }> => {
  try {
    const selected_game = __mobile_games.find((game) => game.game_id === game_id);

    if (!selected_game) {
      throw new Error(`Game not found: ${game_id}`);
    }

    // - PARSE VENDOR VALUE (handle "name::index" format) - \\

    let vendor_data;

    if (vendor_value.includes('::')) {
      // New format: "name::index"
      const [_name, index_str] = vendor_value.split('::');
      const index               = parseInt(index_str, 10);
      const vendors            = get_dummy_vendors_by_game(game_id);
      vendor_data              = vendors[index];
    } else {
      // Old format: just name
      vendor_data = get_dummy_vendor_detail(game_id, vendor_value);
    }

    if (!vendor_data) {
      throw new Error(`Vendor not found: ${vendor_value}`);
    }

    const vendor = {
      name           : vendor_data.name,
      pricing_options: (vendor_data as any).pricing_options || [],
      price          : (vendor_data as any).price,
      stock_status   : vendor_data.stock_status,
      features_list  : vendor_data.features_list,
      description    : vendor_data.description
    };

    const stock_emoji_map = {
      available   : '✓',
      out_of_stock: '✗',
      pre_order   : '◷'
    };

    const stock_emoji = stock_emoji_map[vendor.stock_status as keyof typeof stock_emoji_map] || '•';

    const features_text = vendor.features_list.length > 0
      ? vendor.features_list.map((feature, index) => `${index + 1}. ${feature}`).join('\n')
      : 'No features listed';

    // - BUILD PRICING TEXT - \\

    let pricing_text: string;

    if (vendor.pricing_options && vendor.pricing_options.length > 0) {
      pricing_text = vendor.pricing_options
        .map((opt: pricing_option) => `**${opt.duration}**: Rp ${opt.price.toLocaleString('id-ID')}`)
        .join('\n');
    } else if (vendor.price) {
      pricing_text = `Rp ${vendor.price.toLocaleString('id-ID')}`;
    } else {
      pricing_text = 'Contact for pricing';
    }

    // - BUILD EMBED DESCRIPTION - \\

    const vendor_emoji = __pubg_vendor_emoji_map[vendor.name];
    const header_text  = vendor_emoji
      ? `${vendor_emoji} **${vendor.name}**`
      : `**${vendor.name}**`;

    let description_parts = header_text;

    if (vendor.description) {
      description_parts += `\n\n${vendor.description}`;
    }

    description_parts += `\n\n**Pricing**\n${pricing_text}\n\n**Stock Status**\n${vendor.stock_status.replace('_', ' ')} ${stock_emoji}\n\n**Features**\n${features_text}`;

    // - BUILD EMBED - \\

    const embed = new EmbedBuilder()
      .setColor(0x2B2D31)
      .setTitle(`${selected_game.emoji} ${selected_game.game_name} - Vendor Details`)
      .setDescription(description_parts)
      .setTimestamp();

    // - BUILD BUTTON - \\

    const button = component.create_button_v2(
      'Buy Now',
      5, // ButtonStyle.Link
      'https://discord.gg/ticket-channel-dummy',
      '🛒'
    );

    console.log(`[ - MOBILE_CATALOG_CONTROLLER - ] Vendor detail message built for: ${vendor.name}`);

    return {
      embeds: [embed],
      components: [button]
    };
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

// - INTERACTION HANDLERS - \\

/**
 * Handle mobile game selection from select menu
 * @param interaction StringSelectMenuInteraction
 * @return Promise<void>
 */
const handle_mobile_game_selection = async (interaction: StringSelectMenuInteraction): Promise<void> => {
  try {
    const game_id = interaction.values[0];
    const { embeds, components } = await build_mobile_vendor_selection_embed(game_id);

    await interaction.reply({
      embeds,
      components,
      flags: MessageFlags.Ephemeral
    });

    console.log(`[ - MOBILE_CATALOG_CONTROLLER - ] Mobile game selected: ${game_id}`);
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Handle mobile vendor selection from select menu
 * @param interaction StringSelectMenuInteraction
 * @param game_id string
 * @return Promise<void>
 */
const handle_mobile_vendor_selection = async (
  interaction: StringSelectMenuInteraction,
  game_id    : string
): Promise<void> => {
  try {
    const vendor_value = interaction.values[0];
    const { embeds, components } = await build_mobile_vendor_detail_embed(game_id, vendor_value);

    await interaction.update({
      embeds,
      components
    });

    console.log(`[ - MOBILE_CATALOG_CONTROLLER - ] Mobile vendor selected: ${vendor_value} for game: ${game_id}`);
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Handle mobile catalog interaction
 * @param interaction Interaction
 * @return Promise<void>
 */
const handle_mobile_catalog_interaction = async (interaction: Interaction): Promise<void> => {
  try {
    if (!interaction.isStringSelectMenu()) {
      return;
    }

    const custom_id = interaction.customId;

    if (custom_id === 'mobile_catalog_select_game') {
      await handle_mobile_game_selection(interaction);
    } else if (custom_id.startsWith('mobile_catalog_select_vendor:')) {
      const game_id = custom_id.split(':')[1];
      await handle_mobile_vendor_selection(interaction, game_id);
    }
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Show mobile catalog (PERMANENT MESSAGE)
 * @param interaction Interaction
 * @return Promise<void>
 */
const show_mobile_catalog = async (interaction: Interaction): Promise<void> => {
  try {
    const { embeds, components } = await build_mobile_catalog_embed();

    if (interaction.isRepliable()) {
      const channel = interaction.channel;
      if (!channel || !('send' in channel)) {
        throw new Error('Channel is missing or does not support sending messages');
      }

      await channel.send({
        embeds,
        components
      });

      await interaction.reply({
        content: 'Mobile catalog sent!',
        flags  : MessageFlags.Ephemeral
      });

      console.log('[ - MOBILE_CATALOG_CONTROLLER - ] Mobile catalog displayed successfully');
    }
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

// - EXPORTS - \\

export {
  __mobile_games,
  __game_emoji_map,
  build_mobile_catalog_embed,
  build_mobile_vendor_selection_embed,
  build_mobile_vendor_detail_embed,
  handle_mobile_catalog_interaction,
  show_mobile_catalog
};

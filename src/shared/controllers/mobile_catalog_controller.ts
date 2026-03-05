import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Interaction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction
}                                     from 'discord.js';
import { log_error }                   from '../../utils/error_logger';

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

const __embed_color        = 0x09090b;
const __max_display_items  = 25;

// - EMBED BUILDERS - \\

/**
 * Build mobile games catalog embed
 * @return Promise<{ embed: EmbedBuilder, component: ActionRowBuilder<StringSelectMenuBuilder> }>
 */
const build_mobile_catalog_embed = async (): Promise<{
  embed    : EmbedBuilder;
  component: ActionRowBuilder<StringSelectMenuBuilder>;
}> => {
  try {
    const select_menu          = new StringSelectMenuBuilder();

    select_menu.setCustomId('mobile_catalog_select_game');
    select_menu.setPlaceholder('Select a mobile game');

    const options              = __mobile_games.map((game) => ({
      label     : game.game_name,
      value     : game.game_id,
      description: game.description,
      emoji     : game.emoji
    }));

    select_menu.addOptions(options.slice(0, __max_display_items));

    const row                  = new ActionRowBuilder<StringSelectMenuBuilder>();
    row.addComponents(select_menu);

    // - CREATE CATALOG PANEL - \\

    const embed                = new EmbedBuilder();

    embed.setColor(__embed_color);
    embed.setTitle(`${__game_emoji_map.mobile_legends} Mobile Games Catalog`);
    embed.setDescription('Pilih game mobile untuk melihat katalog produk yang tersedia:');

    // - ADD GAME LIST TO EMBED - \\

    const game_list_text       = __mobile_games.map((game) => {
      return `${game.emoji} **${game.game_name}**\n   └ ${game.description}`;
    }).join('\n\n');

    embed.addFields({
      name     : 'Available Games',
      value    : game_list_text,
      inline   : false
    });

    embed.setTimestamp();
    embed.setFooter({ text: 'Select a game from the dropdown menu below' });

    console.log('[ - MOBILE_CATALOG_CONTROLLER - ] Mobile catalog embed built successfully');

    return {
      embed    : embed,
      component: row
    };
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Build vendor selection embed for selected mobile game
 * @param game_id string
 * @return Promise<{ embed: EmbedBuilder, component: ActionRowBuilder<StringSelectMenuBuilder> }>
 */
const build_mobile_vendor_selection_embed = async (game_id: string): Promise<{
  embed    : EmbedBuilder;
  component: ActionRowBuilder<StringSelectMenuBuilder>;
}> => {
  try {
    const selected_game       = __mobile_games.find((game) => game.game_id === game_id);

    if (!selected_game) {
      throw new Error(`Game not found: ${game_id}`);
    }

    // - TODO: FETCH VENDORS FROM DATABASE - \\

    const sample_vendors      = [
      {
        name        : 'Vendor A',
        price       : 10.50,
        stock_status: 'available'
      },
      {
        name        : 'Vendor B',
        price       : 9.99,
        stock_status: 'available'
      }
    ];

    const select_menu         = new StringSelectMenuBuilder();

    select_menu.setCustomId(`mobile_catalog_select_vendor:${game_id}`);
    select_menu.setPlaceholder('Select a vendor');

    const stock_emoji_map     = {
      available   : '<:stock_available:1234567890>',
      out_of_stock: '<:stock_out:1234567891>',
      pre_order   : '<:stock_preorder:1234567892>'
    };

    const options             = sample_vendors.map((vendor) => {
      const stock_emoji       = stock_emoji_map[vendor.stock_status as keyof typeof stock_emoji_map] || '';

      return {
        label     : vendor.name,
        value     : vendor.name,
        description: `$${vendor.price} - ${vendor.stock_status.replace('_', ' ')} ${stock_emoji}`
      };
    });

    select_menu.addOptions(options.slice(0, __max_display_items));

    const row                 = new ActionRowBuilder<StringSelectMenuBuilder>();
    row.addComponents(select_menu);

    const embed               = new EmbedBuilder();

    embed.setColor(__embed_color);
    embed.setTitle(`${selected_game.emoji} ${selected_game.game_name} - Vendors`);
    embed.setDescription('Silakan pilih vendor untuk melihat detail produk:');
    embed.setTimestamp();

    console.log(`[ - MOBILE_CATALOG_CONTROLLER - ] Vendor selection embed built for game: ${game_id}`);

    return {
      embed    : embed,
      component: row
    };
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Build vendor detail embed with purchase button
 * @param game_id string
 * @param vendor_name string
 * @return Promise<{ embed: EmbedBuilder, component: ActionRowBuilder<ButtonBuilder> }>
 */
const build_mobile_vendor_detail_embed = async (game_id: string, vendor_name: string): Promise<{
  embed    : EmbedBuilder;
  component: ActionRowBuilder<ButtonBuilder>;
}> => {
  try {
    const selected_game       = __mobile_games.find((game) => game.game_id === game_id);

    if (!selected_game) {
      throw new Error(`Game not found: ${game_id}`);
    }

    // - TODO: FETCH VENDOR DETAIL FROM DATABASE - \\

    const vendor              = {
      name         : vendor_name,
      price        : 10.50,
      stock_status : 'available',
      features_list: [
        'Instant Delivery',
        '24/7 Support',
        '100% Legal'
      ]
    };

    const stock_emoji_map     = {
      available   : '<:stock_available:1234567890>',
      out_of_stock: '<:stock_out:1234567891>',
      pre_order   : '<:stock_preorder:1234567892>'
    };

    const stock_emoji        = stock_emoji_map[vendor.stock_status as keyof typeof stock_emoji_map] || '';

    const features_text      = vendor.features_list.length > 0
      ? vendor.features_list.map((feature, index) => `${index + 1}. ${feature}`).join('\n')
      : 'No features listed';

    const embed              = new EmbedBuilder();

    embed.setColor(__embed_color);
    embed.setTitle(`${selected_game.emoji} ${vendor.name} - Product Details`);
    embed.addFields(
      {
        name     : 'Game',
        value    : selected_game.game_name,
        inline   : true
      },
      {
        name     : 'Price',
        value    : `$${vendor.price}`,
        inline   : true
      },
      {
        name     : 'Stock Status',
        value    : `${vendor.stock_status.replace('_', ' ')} ${stock_emoji}`,
        inline   : true
      },
      {
        name     : 'Features',
        value    : features_text,
        inline   : false
      }
    );
    embed.setTimestamp();
    embed.setFooter({ text: 'Click the button below to purchase' });

    const row                = new ActionRowBuilder<ButtonBuilder>();
    const buy_button         = new ButtonBuilder();

    buy_button.setLabel('Buy Now');
    buy_button.setStyle(ButtonStyle.Link);
    buy_button.setURL('https://discord.gg/ticket-channel-dummy');
    buy_button.setEmoji('<:cart:1234567893>');

    row.addComponents(buy_button);

    console.log(`[ - MOBILE_CATALOG_CONTROLLER - ] Vendor detail embed built for: ${vendor_name}`);

    return {
      embed    : embed,
      component: row
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
    const game_id             = interaction.values[0];
    const { embed, component } = await build_mobile_vendor_selection_embed(game_id);

    await interaction.update({
      embeds    : [embed],
      components: [component]
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
    const vendor_name        = interaction.values[0];
    const { embed, component } = await build_mobile_vendor_detail_embed(game_id, vendor_name);

    await interaction.update({
      embeds    : [embed],
      components: [component]
    });

    console.log(`[ - MOBILE_CATALOG_CONTROLLER - ] Mobile vendor selected: ${vendor_name} for game: ${game_id}`);
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

    const custom_id           = interaction.customId;

    if (custom_id === 'mobile_catalog_select_game') {
      await handle_mobile_game_selection(interaction);
    } else if (custom_id.startsWith('mobile_catalog_select_vendor:')) {
      const game_id            = custom_id.split(':')[1];
      await handle_mobile_vendor_selection(interaction, game_id);
    }
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Show mobile catalog
 * @param interaction Interaction
 * @return Promise<void>
 */
const show_mobile_catalog = async (interaction: Interaction): Promise<void> => {
  try {
    const { embed, component } = await build_mobile_catalog_embed();

    if (interaction.isRepliable()) {
      await interaction.reply({
        embeds     : [embed],
        components : [component],
        ephemeral  : false
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

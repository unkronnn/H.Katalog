import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Interaction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction
}                                     from 'discord.js';
import {
  game_category,
  get_game_list,
  get_vendor_detail,
  get_vendor_detail_by_game_id
}                                     from '../../services/catalog_service';
import { log_error }                   from '../../utils/error_logger';
import {
  create_embed_v2,
  create_select_menu_v2,
  create_button_v2
}                                     from '../../utils/components';

// - CONSTANTS - \\

const __embed_color        = null; // No color - shadcn minimal style
const __max_display_items  = 25;

// - EMBED BUILDERS - \\

/**
 * Build initial game selection embed
 * @return Promise<{ embed: EmbedBuilder, component: ActionRowBuilder<StringSelectMenuBuilder> }>
 */
const build_game_selection_embed = async (): Promise<{
  embed    : EmbedBuilder;
  component: ActionRowBuilder<StringSelectMenuBuilder>;
}> => {
  try {
    const game_list            = await get_game_list();

    if (!game_list || game_list.length === 0) {
      throw new Error('No games available in catalog');
    }

    const options              = game_list.map((game) => ({
      label      : game.name,
      value      : game.game_id,
      description: game.vendors.length > 0
        ? `${game.vendors.length} vendors available`
        : 'No vendors available'
    }));

    if (options.length === 0) {
      throw new Error('No valid game options available');
    }

    const component            = create_select_menu_v2(
      'catalog_select_game',
      'Select a game category',
      options.slice(0, __max_display_items)
    );

    const embed                = create_embed_v2(
      'Game Catalog',
      'Please select a game category to view available vendors:',
      __embed_color
    );

    embed.setAuthor({
      name: 'Game Catalog',
      iconURL: 'https://ui.shadcn.com/favicon.ico'
    });

    embed.setFooter({
      text: 'Powered by shadcn/ui',
      iconURL: 'https://ui.shadcn.com/favicon.ico'
    });

    console.log('[ - CATALOG_CONTROLLER - ] Game selection embed built successfully');

    return {
      embed    : embed,
      component: component
    };
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Build vendor selection embed for selected game
 * @param game_id string
 * @return Promise<{ embed: EmbedBuilder, component: ActionRowBuilder<StringSelectMenuBuilder> }>
 */
const build_vendor_selection_embed = async (game_id: string): Promise<{
  embed    : EmbedBuilder;
  component: ActionRowBuilder<StringSelectMenuBuilder>;
}> => {
  try {
    const vendor_list         = await get_vendor_detail_by_game_id(game_id);

    if (!vendor_list || vendor_list.length === 0) {
      throw new Error(`No vendors available for game: ${game_id}`);
    }

    const options             = vendor_list.map((vendor) => {
      const stock_emoji       = vendor.stock_status === 'available'
        ? '<:stock_available:1234567890>'
        : vendor.stock_status === 'out_of_stock'
          ? '<:stock_out:1234567891>'
          : '<:stock_preorder:1234567892>';

      return {
        label      : vendor.name,
        value      : vendor.name,
        description: `$${vendor.price} - ${vendor.stock_status.replace('_', ' ')} ${stock_emoji}`
      };
    });

    if (options.length === 0) {
      throw new Error(`No valid vendor options for game: ${game_id}`);
    }

    const component           = create_select_menu_v2(
      `catalog_select_vendor:${game_id}`,
      'Select a vendor',
      options.slice(0, __max_display_items)
    );

    const embed               = create_embed_v2(
      'Available Vendors',
      'Please select a vendor to view product details:',
      __embed_color
    );

    console.log(`[ - CATALOG_CONTROLLER - ] Vendor selection embed built for game: ${game_id}`);

    return {
      embed    : embed,
      component: component
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
const build_vendor_detail_embed = async (game_id: string, vendor_name: string): Promise<{
  embed    : EmbedBuilder;
  component: ActionRowBuilder<ButtonBuilder>;
}> => {
  try {
    const vendor             = await get_vendor_detail(game_id, vendor_name);

    if (!vendor) {
      throw new Error(`Vendor not found: ${vendor_name}`);
    }

    const stock_emoji        = vendor.stock_status === 'available'
      ? '<:stock_available:1234567890>'
      : vendor.stock_status === 'out_of_stock'
        ? '<:stock_out:1234567891>'
        : '<:stock_preorder:1234567892>';

    const features_text      = vendor.features_list.length > 0
      ? vendor.features_list.map((feature, index) => `${index + 1}. ${feature}`).join('\n')
      : 'No features listed';

    const fields             = [
      {
        name  : 'Price',
        value : `$${vendor.price}`,
        inline: true
      },
      {
        name  : 'Stock Status',
        value : `${vendor.stock_status.replace('_', ' ')} ${stock_emoji}`,
        inline: true
      },
      {
        name  : 'Features',
        value : features_text,
        inline: false
      }
    ];

    const embed              = create_embed_v2(
      `${vendor.name} - Product Details`,
      '',
      __embed_color,
      fields
    );

    embed.setFooter({
      text: 'Click the button below to purchase'
    });

    const component          = create_button_v2(
      'Buy Now',
      ButtonStyle.Link,
      'https://discord.com/channels/1338437118296330292/1473664373980528640',
      '<:cart:1234567893>'
    );

    console.log(`[ - CATALOG_CONTROLLER - ] Vendor detail embed built for: ${vendor_name}`);

    return {
      embed    : embed,
      component: component
    };
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

// - INTERACTION HANDLERS - \\

/**
 * Handle game selection from select menu
 * @param interaction StringSelectMenuInteraction
 * @return Promise<void>
 */
const handle_game_selection = async (interaction: StringSelectMenuInteraction): Promise<void> => {
  try {
    const game_id             = interaction.values[0];
    const { embed, component } = await build_vendor_selection_embed(game_id);

    await interaction.update({
      embeds    : [embed],
      components: [component]
    });

    console.log(`[ - CATALOG_CONTROLLER - ] Game selected: ${game_id}`);
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Handle vendor selection from select menu
 * @param interaction StringSelectMenuInteraction
 * @param game_id string
 * @return Promise<void>
 */
const handle_vendor_selection = async (
  interaction: StringSelectMenuInteraction,
  game_id    : string
): Promise<void> => {
  try {
    const vendor_name        = interaction.values[0];
    const { embed, component } = await build_vendor_detail_embed(game_id, vendor_name);

    await interaction.update({
      embeds    : [embed],
      components: [component]
    });

    console.log(`[ - CATALOG_CONTROLLER - ] Vendor selected: ${vendor_name} for game: ${game_id}`);
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Handle catalog interaction
 * @param interaction Interaction
 * @return Promise<void>
 */
const handle_catalog_interaction = async (interaction: Interaction): Promise<void> => {
  try {
    if (!interaction.isStringSelectMenu()) {
      return;
    }

    const custom_id           = interaction.customId;

    if (custom_id === 'catalog_select_game') {
      await handle_game_selection(interaction);
    } else if (custom_id.startsWith('catalog_select_vendor:')) {
      const game_id            = custom_id.split(':')[1];
      await handle_vendor_selection(interaction, game_id);
    }
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

/**
 * Show initial catalog embed
 * @param interaction Interaction
 * @return Promise<void>
 */
const show_catalog = async (interaction: Interaction): Promise<void> => {
  try {
    const { embed, component } = await build_game_selection_embed();

    if (interaction.isRepliable()) {
      await interaction.reply({
        embeds     : [embed],
        components : [component]
      });

      console.log('[ - CATALOG_CONTROLLER - ] Catalog displayed successfully');
    }
  } catch (error) {
    await log_error(error);
    throw error;
  }
};

// - EXPORTS - \\

export {
  build_game_selection_embed,
  build_vendor_selection_embed,
  build_vendor_detail_embed,
  handle_catalog_interaction,
  show_catalog
};

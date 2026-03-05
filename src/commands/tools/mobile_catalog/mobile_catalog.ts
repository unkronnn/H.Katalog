import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { show_mobile_catalog }              from '../../../shared/controllers/mobile_catalog_controller';
import { log_error }                        from '../../../utils/error_logger';

// - COMMAND DEFINITION - \\

const command_data                       = new SlashCommandBuilder();

command_data.setName('mobile-catalog');
command_data.setDescription('Browse mobile games catalog and purchase products');

// - COMMAND HANDLER - \\

/**
 * Execute mobile catalog command
 * @param interaction any
 * @return Promise<void>
 */
const execute = async (interaction: any): Promise<void> => {
  try {
    console.log('[ - MOBILE_CATALOG_COMMAND - ] Mobile catalog command executed');

    await show_mobile_catalog(interaction);
  } catch (error) {
    await log_error(error);

    console.log('[ - MOBILE_CATALOG_COMMAND - ] Error executing mobile catalog command');

    if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content : 'An error occurred while displaying the mobile catalog. Please try again later.',
        flags   : MessageFlags.Ephemeral
      });
    }
  }
};

// - EXPORTS - \\

export {
  command_data,
  execute
};

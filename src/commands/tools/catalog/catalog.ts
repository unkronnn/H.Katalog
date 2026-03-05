import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { show_catalog }                      from '../../../shared/controllers/catalog_controller';
import { log_error }                         from '../../../utils/error_logger';

// - COMMAND DEFINITION - \\

const command_data                       = new SlashCommandBuilder();

command_data.setName('catalog');
command_data.setDescription('Browse game catalog and purchase products');

// - COMMAND HANDLER - \\

/**
 * Execute catalog command
 * @param interaction any
 * @return Promise<void>
 */
const execute = async (interaction: any): Promise<void> => {
  try {
    console.log('[ - CATALOG_COMMAND - ] Catalog command executed');

    await show_catalog(interaction);
  } catch (error) {
    await log_error(error);

    console.log('[ - CATALOG_COMMAND - ] Error executing catalog command');

    if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content : 'An error occurred while displaying the catalog. Please try again later.',
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

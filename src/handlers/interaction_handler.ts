import { Client, Interaction }                   from 'discord.js';
import { handle_catalog_interaction }            from '../shared/controllers/catalog_controller';
import { handle_mobile_catalog_interaction }     from '../shared/controllers/mobile_catalog_controller';
import { log_error }                              from '../utils/error_logger';

/**
 * Handle all interactions
 * @param client Client
 * @return void
 */
const setup_interaction_handler = (client: Client): void => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    try {
      if (interaction.isStringSelectMenu()) {
        const custom_id    = interaction.customId;

        // - REGULAR CATALOG INTERACTIONS - \\

        if (custom_id.startsWith('catalog_select_')) {
          await handle_catalog_interaction(interaction);
          console.log(`[ - INTERACTION_HANDLER - ] Catalog interaction handled: ${custom_id}`);
        }

        // - MOBILE CATALOG INTERACTIONS - \\

        if (custom_id.startsWith('mobile_catalog_select_')) {
          await handle_mobile_catalog_interaction(interaction);
          console.log(`[ - INTERACTION_HANDLER - ] Mobile catalog interaction handled: ${custom_id}`);
        }
      }
    } catch (error) {
      await log_error(error);
      console.log('[ - INTERACTION_HANDLER - ] Error handling interaction');

      if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content   : 'An error occurred while processing your request.',
          ephemeral : true
        });
      }
    }
  });

  console.log('[ - INTERACTION_HANDLER - ] Interaction handler registered');
};

// - EXPORTS - \\

export {
  setup_interaction_handler
};

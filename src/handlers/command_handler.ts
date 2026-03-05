import { Client, REST, Routes }           from 'discord.js';
import { command_data as catalog }         from '../commands/tools/catalog/catalog';
import { command_data as mobile_catalog }  from '../commands/tools/mobile_catalog/mobile_catalog';
import { log_error }                        from '../utils/error_logger';

// - COMMAND COLLECTION - \\

const __commands       = [
  catalog,
  mobile_catalog
];

const __rest           = new REST({ version: '10' }).setToken(
  process.env.DISCORD_TOKEN || ''
);

/**
 * Register commands to Discord API
 * @param client Client
 * @return Promise<void>
 */
const register_commands = async (client: Client): Promise<void> => {
  try {
    const commands_data    = __commands.map((command) => command.toJSON());

    console.log(`[ - COMMAND_HANDLER - ] Registering ${commands_data.length} commands...`);

    await __rest.put(
      Routes.applicationCommands(
        process.env.CLIENT_ID || ''
      ),
      { body: commands_data }
    );

    console.log('[ - COMMAND_HANDLER - ] Commands registered successfully');

    // - SET UP COMMAND HANDLER - \\

    client.on('interactionCreate', async (interaction) => {
      try {
        if (!interaction.isChatInputCommand()) {
          return;
        }

        const command_name    = interaction.commandName;

        if (command_name === 'catalog') {
          const { execute }   = await import('../commands/tools/catalog/catalog');
          await execute(interaction);
          console.log(`[ - COMMAND_HANDLER - ] Command executed: ${command_name}`);
        }

        if (command_name === 'mobile-catalog') {
          const { execute }   = await import('../commands/tools/mobile_catalog/mobile_catalog');
          await execute(interaction);
          console.log(`[ - COMMAND_HANDLER - ] Command executed: ${command_name}`);
        }
      } catch (error) {
        await log_error(error);
        console.log('[ - COMMAND_HANDLER - ] Error executing command');
      }
    });
  } catch (error) {
    await log_error(error);
    console.log('[ - COMMAND_HANDLER - ] Failed to register commands');
    throw error;
  }
};

// - EXPORTS - \\

export {
  register_commands
};

import { Client, GatewayIntentBits }  from 'discord.js';
import { setup_database }             from './config/database';
import { register_commands }          from './handlers/command_handler';
import { setup_interaction_handler }  from './handlers/interaction_handler';
import { log_error }                  from './utils/error_logger';

// - CLIENT CONFIGURATION - \\

const __client           = new Client({
  intents                : [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

const __token            = process.env.DISCORD_TOKEN || '';

// - BOT STARTUP - \\

/**
 * Start bot
 * @return Promise<void>
 */
const start_bot = async (): Promise<void> => {
  try {
    console.log('[ - BOT - ] Starting bot...');

    // - DATABASE SETUP - \\

    await setup_database();

    // - LOGIN TO DISCORD - \\

    await __client.login(__token);

    console.log('[ - BOT - ] Bot logged in successfully');

    // - REGISTER COMMANDS - \\

    await register_commands(__client);

    // - SETUP INTERACTION HANDLER - \\

    setup_interaction_handler(__client);

    console.log('[ - BOT - ] Bot ready!');
  } catch (error) {
    await log_error(error);
    console.log('[ - BOT - ] Failed to start bot');
    process.exit(1);
  }
};

// - BOT SHUTDOWN - \\

__client.on('process.exit', async () => {
  const { close_database } = await import('./config/database');
  await close_database();
});

process.on('SIGINT', async () => {
  console.log('[ - BOT - ] Shutting down...');
  const { close_database } = await import('./config/database');
  await close_database();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('[ - BOT - ] Shutting down...');
  const { close_database } = await import('./config/database');
  await close_database();
  process.exit(0);
});

// - START BOT - \\

start_bot();

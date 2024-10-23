import { Client } from 'discord.js';
import { config } from 'dotenv';
import Logger from './logger';
import process from 'process';
import { loadCommands, registerSlashCommands, toggleSlashCommands } from './commandHandler';
import { reloadEvents } from './eventHandler';

config();

const setupLogger = new Logger('setup');
const commandsDir = './dist/commands';
const eventsDir = './dist/events';

export default async function setup(client: Client) {

    setupLogger.important('\n' +
        '      _     _      _          _   ____        _   \n' +
        '     | |___| |_   | |_  _____| | | __ )  ___ | |_ \n' +
        '  _  | / __| __|  | \\ \\/ / _ \\ | |  _ \\ / _ \\| __|\n' +
        ' | |_| \\__ \\ || |_| |>  <  __/ | | |_) | (_) | |_ \n' +
        '  \\___/|___/\\__\\___//_/\\_\\___|_| |____/ \\___/ \\__|\n' +
        '\n' +
        `Starting start sequence...\n`);

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CLIENT_ID = process.env.CLIENT_ID;
    const GUILD_ID = process.env.GUILD_ID;
    const DEV = process.env.DEV;


    if ( !BOT_TOKEN || !CLIENT_ID ) {
        process.exit(69);
    }

    await reloadEvents(client, eventsDir);

    await loadCommands(client, commandsDir);

    await registerSlashCommands(BOT_TOKEN, CLIENT_ID, GUILD_ID);
    toggleSlashCommands(client, true);


    let clientReady = false;

    client.once('ready', () => {
        clientReady = true;
        setupLogger.info(`[${ client.user?.username + '#' + client.user?.discriminator }] started on ${ client.guilds.cache.size } guild(s)!`, 'ready');
        setupLogger.important('Done with setup sequence! Bot is ready for use!\n');
    });


    client.login(BOT_TOKEN);


};
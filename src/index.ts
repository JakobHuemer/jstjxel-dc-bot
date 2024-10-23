import { Client, GatewayIntentBits } from 'discord.js';
import Logger from './util/logger';
import setup from './util/setup';
import createWelcomeImage from './util/createWelcomeImage';


const clientLogger = new Logger('main');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
});


setup(client);
import * as fs from 'fs';
import Logger from './logger';
import * as path from 'path';

import { BaseInteraction, Client, CommandInteraction, Interaction, REST, Routes, Snowflake } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { SlashCommand } from '../types/SlashCommand';
import process from 'process';


const commandsLogger = new Logger('commands');

const commands: SlashCommand[] = [];

let commandLoadSummary: {
    failed: number,
    ignored: number,
    loaded: number
};

function argify(options: any): any[] {
    let params: any = [];

    /*
     * 1 Sub Command
     * 2 Sub Command Group
     * 3 String
     * 4 Integer // integer between -2^53 and 2^53
     * 5 Boolean
     * 6 User
     * 7 Channel // all channel types + categories
     * 8 Role
     * 9 Mentionable // all users and roles
     * 10 Number // double between -2^53 and 2^53
     * 11 Attachment // Attachment object
     *
     */

    for ( const option of options ) {
        switch ( option.type ) {
            case 3:
            case 4:
            case 5:
            case 10:
                params.push(option.value);
                break;
            case 6:
                params.push(option.member);
                break;
            case 7:
                params.push(option.channel);
                break;
            case 8:
                params.push(option.role);
                break;
            case 9:
                if ( option.member )
                    params.push(option.member);
                else
                    params.push(option.role);
                break;
        }
    }

    return params;
}

export function toggleSlashCommands(client: Client, option: boolean) {
    if ( !option ) {
        commandsLogger.warn('Application (/) commands disabled!', 'toggle');
        client.removeListener('interactionCreate', toggleSlashCommands);
    } else {
        commandsLogger.info('Application (/) commands enabled!', 'toggle');
        client.on('interactionCreate', async (interaction) => {
            if ( !interaction.isChatInputCommand() || interaction.user.bot ) return;

            let command = commands.find(c => c.data.name == interaction.commandName);


            if ( command && interaction instanceof CommandInteraction ) {
                try {
                    if ( interaction.options ) {
                        // @ts-ignore
                        await command.execute(interaction, client, ...argify(interaction.options._hoistedOptions));
                    } else {
                        await command.execute(interaction, client);
                    }
                } catch ( error ) {
                    commandsLogger.error(`Failed to execute command [${ interaction.commandName }]\nError:\n${ error }`);
                    if ( interaction.replied || interaction.deferred ) {
                        // await interaction.followUp({
                        //     content: 'There was an error while executing this command!',
                        //     ephemeral: true,
                        // });
                    } else {
                        // await interaction.reply({
                        //     content: 'There was an error while executing this command!',
                        //     ephemeral: true,
                        // });
                    }
                    if ( process.env.DEV ) {
                        throw error;
                    }
                }
            }
        });
    }
}

export async function loadCommands(client: Client, dir: string, sub = false) {

    if ( !sub ) {

        commandsLogger.info('Starting to load commands...', 'load');
        commandLoadSummary = {
            failed: 0,
            ignored: 0,
            loaded: 0,
        };
    }

    for ( const item of fs.readdirSync(dir) ) {
        // if item is a dir or a file
        if ( fs.lstatSync(dir + '/' + item).isDirectory() ) {
            await loadCommands(client, dir + '/' + item, true);
        } else {
            try {
                let command = (await import('./../../' + path.join(dir, item))).default;

                command.path = path.join(dir, item)
                    .replace(/(dist|commands)\//gm, '')
                    .replace(/\.js/g, '')
                    .replace(/\/+/g, '.');

                if ( command.ignore ) {
                    commandLoadSummary.ignored++;
                    commandsLogger.warn(`Ignored command at [${ command.path }]`);
                } else if ( command ) {
                    commands.push(command);
                    commandsLogger.log(`Added command at [${ command.path }]`, 'load');
                    commandLoadSummary.loaded++;
                }

            } catch ( error ) {
                commandsLogger.warn(`Failed to add command at ${ path.join(dir, item)
                    .replace(/(dist|commands)\//gm, '')
                    .replace(/\.js/g, '')
                    .replace(/\/+/g, '.') }`, 'load');
                commandLoadSummary.failed++;
            }
        }
    }

    if ( !sub ) {
        commandsLogger.info(`Done loading commands...
            - loaded : ${ commandLoadSummary.loaded }
            - ignored: ${ commandLoadSummary.ignored }
            - failed : ${ commandLoadSummary.failed }`, 'Load');
    }
}


export async function registerSlashCommands(TOKEN: string, CLIENT_ID: string, GUILD_ID?: string) {


    const rest = new REST({ version: '10' }).setToken(TOKEN);

    try {

        let onlyCommandInfo = commands.map(e => e.data);

        commandsLogger.info('Started refreshing application (/) commands.', 'register');

        // @ts-ignore
        await rest.put(Routes.applicationCommands(CLIENT_ID as Snowflake, GUILD_ID as Snowflake), { body: onlyCommandInfo });

        commandsLogger.info('Successfully reloaded application (/) commands.', 'register');
    } catch ( error ) {
        commandsLogger.critical('Failed reloading application (/) commands.', 'register');
    }
}

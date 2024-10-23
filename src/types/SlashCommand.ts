import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction } from 'discord.js';

export interface SlashCommand {

    data: SlashCommandBuilder;
    ignore: boolean | undefined | null;
    autocomplete: () => Promise<void>;
    execute: (interaction: CommandInteraction, client: Client, ...args: any[]) => Promise<void>;
    path: string;
}
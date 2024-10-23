import { SlashCommandBuilder } from '@discordjs/builders';
import { CategoryChannel, Channel, Client, CommandInteraction, GuildMember, Role } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('this is to test')
        .addStringOption(option =>
            option
                .setName('stroption')
                .setDescription('testing')
                .setRequired(true),
        )
        .addIntegerOption(option =>
            option
                .setName('intoption')
                .setDescription('testing')
                .setRequired(true),
        )
        .addBooleanOption(option =>
            option
                .setName('booloption')
                .setDescription('testing')
                .setRequired(true),
        )
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('testing')
                .setRequired(true),
        )
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('testing')
                .setRequired(true),
        )
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('testing')
                .setRequired(true),
        )
        .addMentionableOption(option =>
            option
                .setName('mentionable')
                .setDescription('testing')
                .setRequired(true),
        )
        .addNumberOption(option =>
            option
                .setName('number')
                .setDescription('testing')
                .setRequired(true),
        ),

    async execute(ia: CommandInteraction, client: Client,
                  stroption: string, intoption: bigint, booloption: boolean,
                  user: GuildMember, channel: CategoryChannel | Channel, role: Role,
                  mentionable: Role | GuildMember, number: number) {

        console.log(`stroption: ${ stroption }`);
        console.log('-------------------------------------------------------------------------------------------------------------');
        console.log(`intoption: ${ intoption }`);
        console.log('-------------------------------------------------------------------------------------------------------------');
        console.log(`booloption: ${ booloption }`);
        console.log('-------------------------------------------------------------------------------------------------------------');
        console.log(`user: ${ user }`);
        console.log('-------------------------------------------------------------------------------------------------------------');
        console.log(`channel: ${ channel }`);
        console.log('-------------------------------------------------------------------------------------------------------------');
        console.log(`role: ${ role }`);
        console.log('-------------------------------------------------------------------------------------------------------------');
        console.log(`mentionable: ${ mentionable }`);
        console.log('-------------------------------------------------------------------------------------------------------------');
        console.log(`number: ${ number }`);
        console.log('-------------------------------------------------------------------------------------------------------------');


        await ia.reply({
            content: 'inawdawd',
            ephemeral: true,
        });
    },
};
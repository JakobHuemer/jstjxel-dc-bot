import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction, PermissionFlagsBits } from 'discord.js';
import createWelcomeImage from '../../util/createWelcomeImage';
import * as fs from 'fs';
import Logger from '../../util/logger';

export default {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('The bots says what you want')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addStringOption(option =>
            option
                .setName('message')
                .setDescription('What messages the bot says')
                .setRequired(true),
        ),

    // todo: make handler
    async autocomplete(client: Client) {

    },

    async execute(ia: CommandInteraction, client: Client, message: string) {

        await ia.deferReply({ ephemeral: true });

        let welcomeImage = await createWelcomeImage(ia.user);
        // let welcomeImage = './assets/img/notfound.jpg';

        console.log(message);
        console.log(welcomeImage);

        // send image
        await ia.editReply({
            content: 'this is edited',
            // @ts-ignore
            ephemeral: true,
            files: [ {
                attachment: welcomeImage || './assets/img/notfound.jpg',
            } ],
        });

    },
};
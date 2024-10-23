import { DiscordEvent } from '../types/DiscordEvent';
import { Client, escapeNumberedList, Events, GuildMember } from 'discord.js';
import useGlobalConfigStorage from '../util/storage/useGlobalConfigStorage';
import Logger from '../util/logger';
import createWelcomeImage from '../util/createWelcomeImage';

export default {
    name: Events.GuildMemberAdd,
    once: false,

    /**
     * @param {Client} client
     * @param {GuildMember} member
     */

    async execute(client: Client, member: GuildMember) {

        let channelId = useGlobalConfigStorage.welcomeChannel;

        const welcomeLogger = new Logger('ev welcome');

        if ( !channelId ) {
            welcomeLogger.warn('No welcome channel set!');
            return;
        }

        let channel = member.guild.channels.cache.get(channelId);

        if ( !channel ) {
            welcomeLogger.warn('Welcome channel provided does not exist!');
            return;
        }

        if ( !channel.isTextBased() ) {
            welcomeLogger.warn('Welcome channel is not text based!');
            return;
        }

        let welcomeImage = await createWelcomeImage(member.user);

        if ( welcomeImage ) {
            channel.send({
                content: `Welcome <@${ member.user.id }>!`,
                files: [ { attachment: welcomeImage } ],
            });
        }
    },
};
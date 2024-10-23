import { Events, VoiceState, Client } from 'discord.js';

export default {
    name: Events.VoiceStateUpdate,
    once: false,

    /**
     *
     * @param client
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     *
     */

    execute(client: Client, oldState: VoiceState, newState: VoiceState) {


    },
};
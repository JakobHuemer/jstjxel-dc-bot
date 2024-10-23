import UseStorage from './useStorage';
import { GlobalConfigStorage } from '../../types/GlobalConfigStorage';
import { Base, BaseChannel, Role, TextBasedChannel, WelcomeChannel } from 'discord.js';

class UseGlobalConfigStorage extends UseStorage<GlobalConfigStorage> {
    constructor() {
        super(
            {
                defaultMemberRole: null,
                welcomeChannel: null,
            },
            'config',
        );
    }


    set defaultMemberRole(v: string | number | Role | null) {
        this.storage.defaultMemberRole = v instanceof Role ? v.id.toString() : v?.toString() || null;
    }

    get defaultMemberRole() {
        return this.storage.defaultMemberRole;
    }

    set welcomeChannel(v: string | null) {
        this.storage.welcomeChannel = v;
    }

    get welcomeChannel() {
        return this.storage.welcomeChannel;
    }
}

export default new UseGlobalConfigStorage();
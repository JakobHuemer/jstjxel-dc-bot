import { Storageable } from './Storageable';

export interface GlobalConfigStorage extends Storageable {
    defaultMemberRole: string | null;
    welcomeChannel: string | null;
}
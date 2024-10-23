export interface DiscordEvent {
    name: string;
    once: boolean;
    ignore: boolean | undefined | null;
    execute: (...args: any[]) => Promise<void>;
    path: string;
}
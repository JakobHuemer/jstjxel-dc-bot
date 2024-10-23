import * as fs from 'fs';
import path from 'path';
import { Client } from 'discord.js';
import Logger from './logger';
import { DiscordEvent } from '../types/DiscordEvent';

let events: DiscordEvent[] = [];


let eventLoadSummary = {
    ignored: 0,
    failed: 0,
    loaded: 0,
};

const eventsLogger = new Logger('events');

export async function reloadEvents(client: Client, dir: string, sub = false) {

    if ( !sub ) {

        eventsLogger.info('Starting to load events...', 'load');

        for ( const oldEvent of events ) {
            client.removeListener(oldEvent.name, oldEvent.execute);
        }

        eventLoadSummary = {
            ignored: 0,
            failed: 0,
            loaded: 0,
        };
    }


    for ( const item of fs.readdirSync(dir) ) {
        // if item is a dir or a file
        if ( fs.lstatSync(dir + '/' + item).isDirectory() ) {
            await reloadEvents(client, dir + '/' + item, true);
        } else {
            try {
                let event = (await import('./../../' + path.join(dir, item))).default;

                event.path = path.join(dir, item)
                    .replace(/(dist|events)\//gm, '')
                    .replace(/\.js/g, '')
                    .replace(/\/+/g, '.');

                if ( event.ignore ) {
                    eventLoadSummary.ignored++;
                    eventsLogger.warn(`Ignored Event at [${ event.path }]`);
                } else if ( event ) {
                    events.push(event);
                    eventsLogger.log(`Added Event at [${ event.path }]`, 'load');
                    eventLoadSummary.loaded++;
                }

            } catch ( error ) {
                eventsLogger.warn(`Failed to add Event at ${ path.join(dir, item)
                    .replace(/(dist|events)\//gm, '')
                    .replace(/\.js/g, '')
                    .replace(/\/+/g, '.') }`, 'load');
                eventLoadSummary.failed++;
            }
        }
    }


    if ( !sub ) {

        eventsLogger.info('Registering events...');
        for ( const event of events ) {
            client.on(event.name, (...args: any) => {
                try {
                    event.execute(client, ...args);
                } catch ( error ) {
                    eventsLogger.error('Error executing event');
                }
            });
            eventsLogger.log(`Registered event at [${ event.path }]`, 'register');
        }


        eventsLogger.info(`Done loading and registering events...
            - loaded : ${ eventLoadSummary.loaded }
            - ignored: ${ eventLoadSummary.ignored }
            - failed : ${ eventLoadSummary.failed }`, 'Load');

    }

}
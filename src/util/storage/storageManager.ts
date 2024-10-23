import * as fs from 'fs';

const STORAGE_LOCATION = './storage.json';

export let storageData: any = JSON.parse(fs.readFileSync(STORAGE_LOCATION, 'utf-8'));

export function save() {
    fs.writeFileSync(
        STORAGE_LOCATION,
        JSON.stringify(storageData, null, 4),
    );
}


process.on('exit', () => {
    save();
});

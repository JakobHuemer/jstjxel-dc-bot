import * as storageManager from './storageManager';
import { Storageable } from '../../types/Storageable';


export default abstract class UseStorage<T extends Storageable> {
    private readonly path: string[];
    private readonly rootStorage: any;
    protected storage: T;
    private readonly defStructure: T;
    private readonly storageManager = storageManager;


    protected constructor(defStructure: T, path: string | string[]) {
        if ( path == '' ) {
            throw new Error('Path is empty!');
        }
        this.defStructure = defStructure;
        this.rootStorage = storageManager.storageData;
        this.path = typeof path == 'string' ? path.split('.') : path;

        console.debug(this.path);


        this.verify();
        // @ts-ignore
        if ( !this.storage ) {
            throw new Error('Storage is undefined, could not resolve Storage!');
        }

        this.update();
    }

    private verify() {

        let currentPos: any = this.rootStorage;

        for ( const p of this.path.slice(0, this.path.length - 1) ) {

            console.log(p);

            if ( !currentPos[p] ) {
                currentPos[p] = {};
            }
            currentPos = currentPos[p];
        }

        if ( !currentPos[this.path[this.path.length - 1]] ) {
            currentPos[this.path[this.path.length - 1]] = this.defStructure;
        }

        this.storage = currentPos[this.path[this.path.length - 1]];
    }

    public save() {
        this.storageManager.save();
    }


    // todo: add new keys from defStorage with correct values recursively
    private update(currentShould?: any, currentActual?: any) {
        if ( !currentActual || !currentShould ) {
            currentActual = this.storage;
            currentShould = this.defStructure;
        }

        function isIndexable(obj: any): obj is {
            [key: string]: any;
        } {
            if ( Array.isArray(obj) ) {
                return false; // Exclude arrays
            }
            return typeof obj === 'object' && obj !== null;
        };

        for ( const [ key, value ] of Object.entries(currentShould) ) {
            if ( !currentActual[key] ) {
                currentActual[key] = value;
            } else if ( isIndexable(value) && currentShould[key] ) {
                this.update(currentShould[key], value);
            }
        }


    }

};


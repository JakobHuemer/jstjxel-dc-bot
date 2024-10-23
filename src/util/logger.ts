import * as fs from 'fs';
import chalk from 'chalk';


function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${ year }.${ month }.${ day } ${ hours }:${ minutes }:${ seconds }`;
}

class LogLevel {
    readonly name: string;
    readonly fnc: Function;

    private constructor(name: string, fnc: Function) {
        this.name = name;
        this.fnc = fnc;
    }

    static LOG = new LogLevel('LOG', chalk.white);
    static DEBUG = new LogLevel('DEBUG', chalk.magentaBright);
    static INFO = new LogLevel('INFO', chalk.green);
    static WARN = new LogLevel('WARN', chalk.yellowBright);
    static ERROR = new LogLevel('ERROR', chalk.red);
    static CRITICAL = new LogLevel('CRITICAL', chalk.redBright);
    static IMPORTANT = new LogLevel('IMPORTANT', chalk.cyanBright);
}


interface LogWriter {
    file: fs.WriteStream,
    logFileName: string,
    write: (param: string) => void,
}

const logFileName = 'logs.log';

let headerWritten = false;
const file = fs.createWriteStream(__dirname + `/../../${ logFileName }`, { flags: 'a', encoding: 'utf-8' });

(() => {
    file.write(`------------------------------------------------------------------------\n\n\n\n\n\n${ new Date().toISOString() } ------------------------------------------------------------------------------------------------------------\n`);
})();

function write(data: string): void {
    // @ts-ignore
    file.write(data + '\n', 'utf-8', (e) => {
        if ( e ) {
            console.log(chalk.red('ERROR WRITING DATA TO LOG FILE'));
            console.log(chalk.red('ERROR WRITING DATA TO LOG FILE'));
            console.log(chalk.red('ERROR WRITING DATA TO LOG FILE'));
            console.log(chalk.red('ERROR WRITING DATA TO LOG FILE'));
        }
    });
}


class Log {
    readonly name: string;
    readonly sub?: string;
    readonly logLevel: LogLevel;
    readonly message: string;

    constructor(message: string, name: string, logLevel: LogLevel, sub?: string) {
        this.message = message;
        this.name = name.replace(/\s./gm, '_').toUpperCase();
        this.sub = sub?.replace(/\s./gm, '_').toUpperCase();
        this.logLevel = logLevel;
    }

    private getPreLog() {
        const now = new Date();

        return `[${ formatDate(now) }] ` +
            `[${ this.name }]` +
            (!this.sub ? '' : ` [${ this.sub }]`) +
            (this.logLevel.name == LogLevel.LOG.name ? '' : ' ' + this.logLevel.name) + ':';
    }

    public repr() {
        let preLog = this.getPreLog();
        let length = preLog.length;

        return preLog + ' ' + this.message.replace(/(?<=\n)^/gm, '                                  ');
    }
}

export default class Logger {

    private readonly name: string;
    private readonly write: (param: string) => void;

    constructor(name: string) {
        this.name = name.replace(/\s./gm, '_').toUpperCase();
        this.write = write;
    }


    private genLog(log: Log) {
        let logMessage = log.repr();
        this.write(logMessage);
        console.log(log.logLevel.fnc(logMessage));
    }

    public log(msg: string, sub?: string) {
        this.genLog(new Log(
            msg, this.name, LogLevel.LOG, sub,
        ));
    }

    public debug(msg: string, sub?: string) {
        this.genLog(new Log(
            msg, this.name, LogLevel.DEBUG, sub,
        ));
    }

    public warn(msg: string, sub?: string) {
        this.genLog(new Log(
            msg, this.name, LogLevel.WARN, sub,
        ));
    }

    public error(msg: string, sub?: string) {
        this.genLog(new Log(
            msg, this.name, LogLevel.ERROR, sub,
        ));
    }

    public info(msg: string, sub?: string) {
        this.genLog(new Log(
            msg, this.name, LogLevel.INFO, sub,
        ));
    }

    public important(msg: string, sub?: string) {
        this.genLog(new Log(
            msg, this.name, LogLevel.IMPORTANT, sub,
        ));
    }

    public critical(msg: string, sub?: string) {
        this.genLog(new Log(
            msg, this.name, LogLevel.CRITICAL, sub,
        ));
    }

}
import * as commands from '../commands'
import { InvalidCommand } from '../errors/invalidCommand';
import { Command } from './command';

export class CommandFactory {

    factory(command: string): Command {
        switch (command) {
            case 'ping':
                return new commands.Ping()
            default:
                throw new InvalidCommand();
        }
    }
}
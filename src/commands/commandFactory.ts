import * as commands from '../commands'
import { InvalidCommand } from '../errors/invalidCommand';
import { Command } from './command';
import CommandMusic from './music_utils/commandMusic';

export class CommandFactory {

    commandMusic: CommandMusic

    constructor(){
        this.commandMusic = new CommandMusic()
    }

    factory(command: string): Command {
        switch (command) {
            case 'ping':
                return new commands.Ping()
            case 'play':
                return new commands.Play(this.commandMusic)
            case 'leave':
                return new commands.Leave(this.commandMusic)
            case 'skip':
                return new commands.Skip(this.commandMusic)
            case 'pause':
                return new commands.Pause(this.commandMusic)
            case 'resume':
                return new commands.Resume(this.commandMusic)
            case 'stop':
                return new commands.Stop(this.commandMusic)
            default:
                throw new InvalidCommand();
        }
    }
}

import * as commands from '../commands'
import { InvalidCommand } from '../errors/invalidCommand';
import { Command } from './command';
import MusicController from '../music/musicController';

export class CommandFactory {

    commandMusic: MusicController

    constructor(){
        this.commandMusic = new MusicController()
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
            case 'loop':
                return new commands.Loop(this.commandMusic)
            case 'unloop':
                return new commands.UnLoop(this.commandMusic)
            default:
                throw new InvalidCommand();
        }
    }
}

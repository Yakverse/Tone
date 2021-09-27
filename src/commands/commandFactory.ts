import * as commands from '../commands'
import { InvalidCommand } from '../errors/invalidCommand';
import { Command } from './command';

export class CommandFactory {

    factory(command: string): Command {
        switch (command) {
            case 'ping':
                return new commands.Ping()
            case 'play':
                return new commands.Play()
            case 'leave':
                return new commands.Leave()
            case 'skip':
                return new commands.Skip()
            case 'pause':
                return new commands.Pause()
            case 'resume':
                return new commands.Resume()
            case 'stop':
                return new commands.Stop()
            case 'loop':
                return new commands.Loop()
            case 'unloop':
                return new commands.Unloop()
            case 'help':
                return new commands.Help()
            default:
                throw new InvalidCommand();
        }
    }
}

import * as commands from '../commands'
import InvalidCommand from '../errors/invalidCommand';
import { Command } from './command';

export class CommandFactory {

    factory(command: string): Command {
        switch (command) {
            case 'ping':
                return new commands.Ping()
            case 'play' || 'p':
                return new commands.Play()
            case 'leave' || 'l':
                return new commands.Leave()
            case 'skip' || 's':
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
            case 'help' || 'h':
                return new commands.Help()
            case 'queue' || 'q':
                return new commands.Queue()
            case 'invite':
                return new commands.Invite()
            case 'join' || 'j':
                return new commands.Join()
            default:
                throw new InvalidCommand();
        }
    }
}

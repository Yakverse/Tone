import * as commands from '../commands'
import { InvalidCommand } from '../errors/invalidCommand';
import { Command } from './command';
import CommandMusic from './music_utils/commandMusic';
import {CommandInteraction, Message} from "discord.js";

export class CommandFactory {

    commandMusic: CommandMusic

    constructor(){
        this.commandMusic = new CommandMusic()
    }

    factory(command: string, message: Message | CommandInteraction): Command {
        this.commandMusic.message = message
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

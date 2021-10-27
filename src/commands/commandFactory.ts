import * as commands from '../commands'
import InvalidCommand from '../errors/invalidCommand';
import Utils from '../utils/utils';
import { Command } from './command';

export class CommandFactory {

    // Full command name only
    commands: string[] = ['ping', 'play', 'leave', 'skip', 'pause', 'resume', 'stop', 'loop', 'unloop', 'help', 'queue', 'invite', 'join']

    factory(command: string): Command | string[] {
        for (let commandClass of Object.values(commands)) {
            if (commandClass.properties.aliases.includes(command)){
                return new commandClass()
            }
        }

        return this.checkMispelled(command);

    }

    checkMispelled(command: string): string[] {
        let rating = []

        for (let a of this.commands) {
            let d = Utils.levenshteinDistance(a, command)
            let obj: any = {}
            obj[a] = d
            rating.push(obj)
        }

        let lowerValue: number = Math.min.apply(Math, rating.map(o => Object.values(o)[0]) as number[])
        let lowerCommands: any[] = rating.filter(o => Object.values(o)[0] === lowerValue)

        if (lowerCommands.length == this.commands.length || lowerValue > 3) // The closer to 0, the more similar
            throw new InvalidCommand()
        
        let probableCommands: string[] = []
        lowerCommands.map(e => {  probableCommands.push(Object.keys(e)[0]) })
        
        return probableCommands
    }
}

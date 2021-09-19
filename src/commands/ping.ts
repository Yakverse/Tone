import { CommandInteraction, Message } from "discord.js";
import { Command } from "./command";

export default class Ping implements Command {

    name: string = 'ping'
    description: string = 'Test ping'
    options: Array<string> = []

    execute(message: Message | CommandInteraction): void{
        if (message instanceof Message)
            message.channel.send('Pong!')
        else 
            message.reply('Pong!')
    }
}
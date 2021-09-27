import {CommandInteraction, Message} from "discord.js";
import {environment} from "../environments/environment";
import Bot from "../config/bot";

export default class Help{

    name: string = 'help'
    description: string = 'need some help? wanna know the commands?'
    options: Array<string> = []

    execute(message: Message | CommandInteraction): void{
        let fields = ""
        for (let i = 0; i < Bot.slashCommands.body.length; i++) {
            const command: any = Bot.slashCommands.body[i]
            fields += `${command.name} | ${command.description}\n`
        }
        message.reply(`Commands\nprefix: ${environment.prefix}\n\n${fields}`)
    }

}

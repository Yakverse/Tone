import {CommandInteraction, Message} from "discord.js";
import {Embed} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";
import {Command} from "./command";
import App from "../main";
import { BOT } from "../utils/constants";
import { CommandPropertiesInterface } from "../interfaces/CommandProperties.interface";

export default class Help implements Command{

    static properties: CommandPropertiesInterface = {
        name: 'help',
        description: 'need some help? wanna know the commands?',
        aliases: ['help', 'h']
    }

    execute(message: Message | CommandInteraction): void{
        let fields = ""
        for (let i = 0; i < App.bot.commands.length; i++) {
            const command: any = App.bot.commands[i]
            fields += `${command.properties.name} | ${command.properties.description}\n`
        }

        let embed = Embed.create(`Commands\nprefix: ${BOT.PREFIX}\n\n${fields}`, ColorsEnum.GRAY)
        message.reply({embeds:[embed.build()]})
    }

}

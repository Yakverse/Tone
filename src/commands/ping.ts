import { CommandInteraction, Message } from "discord.js";
import { Command } from "./command";
import {Embeds} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";

export default class Ping implements Command {

    name: string = 'ping'
    description: string = 'Test ping'
    options: Array<string> = []

    execute(message: Message | CommandInteraction): void{
        let embed = new Embeds({
            hexColor: ColorsEnum.GRAY,
            description: '**🏓  Pong!  🏓**'
        })

        if (message instanceof Message)
            message.channel.send({embeds:[embed.build()]})
        else 
            message.reply({embeds:[embed.build()]})
    }
}
import { CommandInteraction, Message } from "discord.js";
import { Command } from "./command";
import {Embed, Field} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";
import App from "../main";

export default class Ping implements Command {

    static properties: CommandPropertiesInterface = {
        name: 'ping',
        description: 'Test ping',
        aliases: ['ping']
    }

    execute(message: Message | CommandInteraction): void{
        if (!message.channel) return
        message.channel.send(
            {
                embeds: [Embed.create(`🧠 Calculating...`, ColorsEnum.YELLOW, '**Ping  🏓**').build()]
            }
        ).then(async (msg) =>{
            let embed = Embed.create("", ColorsEnum.WHITE, '**Pong  🏓**')
            embed.addField(new Field(`🤖`, `<:discord:894070912519917639>`, true))
            embed.addField(new Field(`${msg.createdTimestamp - message.createdTimestamp}ms`, `**${Math.round(App.bot.client.ws.ping)}ms**`, true))
            msg.edit({embeds:[embed.build()]})
        })
    }
}

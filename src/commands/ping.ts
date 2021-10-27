import { CommandInteraction, Message } from "discord.js";
import { Command } from "./command";
import {Embeds, Field} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";
import App from "../main";

export default class Ping implements Command {

    static properties: CommandPropertiesInterface = {
        name: 'ping',
        description: 'Test ping',
        options: [],
        aliases: ['ping']
    }

    execute(message: Message | CommandInteraction): void{

        if (!message.channel) return
        message.channel.send({embeds:[new Embeds({
            title: '**Pong  🏓**',
            hexColor: ColorsEnum.YELLOW,
            description: `🧠 Calculating...`
        }).build()]}).then(async (msg) =>{
            let embed: Embeds = new Embeds({
                title: '**Pong  🏓**',
                hexColor: ColorsEnum.WHITE,
            })
            embed.addField(new Field(`🤖`, `<:discord:894070912519917639>`,true))
            embed.addField(new Field(`${msg.createdTimestamp - message.createdTimestamp}ms`, `**${Math.round(App.bot.client.ws.ping)}ms**`, true))
            msg.edit({embeds:[embed.build()]})
        })
    }
}

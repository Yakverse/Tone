import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import MusicCommand from "./musicCommand";
import SucessEmbed from "../embeds/sucessEmbed";
import { CommandPropertiesInterface } from "../interfaces/CommandProperties.interface";

export default class Pause extends MusicCommand implements Command {

    static properties: CommandPropertiesInterface = {
        name: 'resume',
        description: 'Resume the song',
        aliases: ['resume']
    }

    execute(message: Message | CommandInteraction) {
        if(message.member instanceof GuildMember){
            this.musicController.resume(message);
            message.reply({embeds:[SucessEmbed.create("Resume ⏯").build()]});
        }
    }
}

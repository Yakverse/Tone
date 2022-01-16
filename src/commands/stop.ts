import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import MusicCommand from "./musicCommand";
import SucessEmbed from "../embeds/sucessEmbed";
import { CommandPropertiesInterface } from "../interfaces/CommandProperties.interface";

export default class Skip extends MusicCommand implements Command {

    static properties: CommandPropertiesInterface = {
        name: 'stop',
        description: 'Stop the song and clear queue',
        aliases: ['stop']
    }

    execute(message: Message | CommandInteraction) {
        if(message.member instanceof GuildMember){
            this.musicController.stop(message);
            message.reply({embeds:[SucessEmbed.create("Stop ⏹").build()]});
        }
    }
}

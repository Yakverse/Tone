import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import MusicCommand from "./musicCommand";
import SucessEmbed from "../embeds/sucessEmbed";

export default class Pause extends MusicCommand implements Command {

    static properties: CommandPropertiesInterface = {
        name: 'pause',
        description: 'Pause the song',
        options: [],
        aliases: ['pause']
    }

    execute(message: Message | CommandInteraction)  {
        if(message.member instanceof GuildMember){
            this.musicController.pause(message);
            message.reply({embeds:[new SucessEmbed("paused").build()]});
        }
    }
}

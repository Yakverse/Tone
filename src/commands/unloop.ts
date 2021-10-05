import {Command} from "./command";
import {CommandInteraction, GuildMember, Message} from "discord.js";
import MusicCommand from "./musicCommand";
import SucessEmbed from "../embeds/sucessEmbed";

export default class Unloop extends MusicCommand implements Command {

    name: string = 'unloop'
    description: string = 'unloop the song'
    options: Array<string> = []

    execute(message: Message | CommandInteraction) {
        if(message.member instanceof GuildMember){
            this.musicController.unloop(message);
            message.reply({embeds:[new SucessEmbed("Unlooped").build()]});
        }
    }
}

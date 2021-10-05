import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import MusicCommand from "./musicCommand";
import SucessEmbed from "../embeds/sucessEmbed";

export default class Skip extends MusicCommand implements Command {

    name: string = 'stop'
    description: string = 'Stop the song and clear queue'
    options: Array<string> = []

    execute(message: Message | CommandInteraction) {
        if(message.member instanceof GuildMember){
            this.musicController.stop(message);
            message.reply({embeds:[new SucessEmbed("Stop").build()]});
        }
    }
}

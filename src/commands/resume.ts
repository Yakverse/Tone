import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import MusicCommand from "./musicCommand";
import SucessEmbed from "../embeds/sucessEmbed";

export default class Pause extends MusicCommand implements Command {

    name: string = 'resume'
    description: string = 'Resume the song'
    options: Array<string> = []

    execute(message: Message | CommandInteraction) {
        if(message.member instanceof GuildMember){
            this.musicController.resume(message);
            message.reply({embeds:[new SucessEmbed("Resume").build()]});
        }
    }
}
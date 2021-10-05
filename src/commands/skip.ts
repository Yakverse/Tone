import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import MusicCommand from "./musicCommand";
import SucessEmbed from "../embeds/sucessEmbed";

export default class Skip extends MusicCommand implements Command {

    name: string = 'skip'
    description: string = 'Skip a song'
    options: Array<string> = []

    execute(message: Message | CommandInteraction) {
        if (message.member instanceof GuildMember) {
            this.musicController.skip(message)
            message.reply({embeds: [new SucessEmbed("Skipped").build()]})
        }
    }
}


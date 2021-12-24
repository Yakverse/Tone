import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import MusicCommand from "./musicCommand";
import SucessEmbed from "../embeds/sucessEmbed";

export default class Skip extends MusicCommand implements Command {

    static properties: CommandPropertiesInterface = {
        name: 'skip',
        description: 'Skip a song',
        aliases: ['skip', 's']
    }

    execute(message: Message | CommandInteraction) {
        if (message.member instanceof GuildMember) {
            this.musicController.skip(message)
            message.reply({embeds: [SucessEmbed.create("Skipped ⏭").build()]})
        }
    }
}


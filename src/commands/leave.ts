import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import MusicCommand from "./musicCommand";
import SucessEmbed from "../embeds/sucessEmbed";

export default class Leave extends MusicCommand implements Command {

    static properties: CommandPropertiesInterface = {
        name: 'leave',
        description: 'Leave the voice channel',
        aliases: ['leave', 'l']
    }

    execute(message: Message | CommandInteraction) {
        if (message.member instanceof GuildMember) {
            this.musicController.leave(message);
            message.reply({embeds: [SucessEmbed.create("Bye Bye!").build()]});
        }
    }
}

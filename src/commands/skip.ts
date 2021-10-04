import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import Queue from "../music/queue";
import MusicCommand from "./musicCommand";
import {Embeds} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";
import Utils from "../utils/utils";

export default class Skip extends MusicCommand implements Command {

    name: string = 'skip'
    description: string = 'Skip a song'
    options: Array<string> = []

    execute(message: Message | CommandInteraction) {
        if (message.member instanceof GuildMember) {
            const guildId: string = message.member.guild.id;
            let track: Queue | undefined = this.musicController.guilds.get(guildId);
            Utils.isInSameVoiceChannel(track, message);
            this.musicController.skip(guildId)
            let embed = new Embeds({
                hexColor: ColorsEnum.GRAY,
                description: 'Skipped',
            })
            message.reply({embeds: [embed.build()]})
        }
    }
}


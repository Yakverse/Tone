import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import Queue from "../music/queue";
import MusicCommand from "./musicCommand";
import {Embeds} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";
import Utils from "../utils/utils";

export default class Leave extends MusicCommand implements Command {

    name: string = 'leave'
    description: string = 'Leave the voice channel'
    options: Array<string> = []

    execute(message: Message | CommandInteraction) {
        if (message.member instanceof GuildMember) {
            const guildId: string = message.member.guild.id;
            let track: Queue | undefined = this.musicController.guilds.get(guildId);
            Utils.isInSameVoiceChannel(track, message, false);
            this.musicController.leave(guildId);
            let embed = new Embeds({
                hexColor: ColorsEnum.GREEN,
                description: `Bye Bye!`,
            });
            message.reply({embeds: [embed.build()]});

        }
    }
}
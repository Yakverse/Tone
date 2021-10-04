import {Command} from "./command";
import {CommandInteraction, GuildMember, Message} from "discord.js";
import Queue from "../music/queue";
import MusicCommand from "./musicCommand";
import {Embeds} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";
import Utils from "../utils/utils";

export default class Unloop extends MusicCommand implements Command {

    name: string = 'unloop'
    description: string = 'unloop the song'
    options: Array<string> = []

    execute(message: Message | CommandInteraction) {
        if(message.member instanceof GuildMember){
            const guildId: string = message.member.guild.id;
            let track: Queue | undefined = this.musicController.guilds.get(guildId);
            Utils.isInSameVoiceChannel(track,message);
            this.musicController.unloop(guildId);
            let embed = new Embeds({
                hexColor: ColorsEnum.GREEN,
                description: `Unlooped!`,
            });
            message.reply({embeds:[embed.build()]});
        }
    }
}

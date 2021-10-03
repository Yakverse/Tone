import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import Queue from "../music/queue";
import MusicCommand from "./musicCommand";
import {Embeds} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";

export default class Skip extends MusicCommand implements Command {

    name: string = 'stop'
    description: string = 'Stop the song and clear queue'
    options: Array<string> = []

    execute(message: Message | CommandInteraction) {
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const guildId: string = message.member.guild.id
            let track: Queue | undefined = this.musicController.guilds.get(guildId)
            if (!track) return;
            if (!track.voiceConnection) {
                let embed = new Embeds({
                    hexColor: ColorsEnum.RED,
                    description: 'I\'m not in a voice channel',
                })
                message.reply({embeds:[embed.build()]})
                return
            }

            let embed = new Embeds({
                hexColor: ColorsEnum.GRAY,
                description: 'Stop',
            })

            this.musicController.stop(guildId)
            message.reply({embeds:[embed.build()]})
        }
    }
    
}

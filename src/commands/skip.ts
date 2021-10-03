import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import Queue from "../music/queue";
import MusicCommand from "./musicCommand";
import {Embeds} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";

export default class Skip extends MusicCommand implements Command {

    name: string = 'skip'
    description: string = 'Skip a song'
    options: Array<string> = []

    execute(message: Message | CommandInteraction) {
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const guildId: string = message.member.guild.id
            let track: Queue | undefined = this.musicController.guilds.get(guildId)
            if (!track) {
                let embed = new Embeds({
                    hexColor: ColorsEnum.RED,
                    description: 'I\'m not in a voice channel',
                })
                message.reply({embeds:[embed.build()]})
                return
            }
            if (track.voiceConnection.joinConfig.channelId === message.member.voice.channel.id) {
                this.musicController.skip(guildId)

                let embed = new Embeds({
                    hexColor: ColorsEnum.GRAY,
                    description: 'Skipped',
                })

                message.reply({embeds:[embed.build()]})
            } else {

                let embed = new Embeds({
                    hexColor: ColorsEnum.GRAY,
                    description: `I'm not in the same voice channel as you`,
                })

                message.reply({embeds:[embed.build()]})
            }
        }
    }
    
}

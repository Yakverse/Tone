import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import {VoiceConnection} from "@discordjs/voice";
import Queue from "../music/queue";
import MusicCommand from "./musicCommand";
import {Embeds} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";

export default class Leave extends MusicCommand implements Command {
    
    name: string = 'leave'
    description: string = 'Leave the voice channel'
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
                return;
            }
            let voiceConnection: VoiceConnection = track!.voiceConnection
            if (voiceConnection.joinConfig.channelId === message.member.voice.channel.id) {
                this.musicController.leave(guildId)
                let embed = new Embeds({
                    hexColor: ColorsEnum.GREEN,
                    description: `Bye Bye!`,
                })
                message.reply({embeds:[embed.build()]})
            } else {
                let embed = new Embeds({
                    hexColor: ColorsEnum.RED,
                    description: `I'm not in the same voice channel as you`,
                })
                message.reply({embeds:[embed.build()]})
            }

        } else {
            let embed = new Embeds({
                hexColor: ColorsEnum.RED,
                description: 'You must be in a voice channel to use this command',
            })
            message.reply({embeds:[embed.build()]})
            return
        }

    }

}

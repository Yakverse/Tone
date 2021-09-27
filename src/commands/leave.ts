import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import MusicController from "../music/musicController";
import {VoiceConnection} from "@discordjs/voice";
import Queue from "../music/queue";

export default class Leave implements Command {
    
    name: string = 'leave'
    description: string = 'Leave the voice channel'
    options: Array<string> = []
    
    constructor(public musicController: MusicController){}

    execute(message: Message | CommandInteraction) {
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const guildId: string = message.member.guild.id
            let track: Queue | undefined = this.musicController.guilds.get(guildId)
            if (!track) {
                message.reply(`I'm not in a voice channel`)
                return;
            }
            let voiceConnection: VoiceConnection = track!.voiceConnection
            if (voiceConnection.joinConfig.channelId === message.member.voice.channel.id) {
                this.musicController.leave(guildId)
                message.reply('Bye Bye!')
            } else message.reply(`I'm not in the same voice channel as you`)

        } else {
            message.reply('You must be in a voice channel to use this command')
            return
        }

    }

}

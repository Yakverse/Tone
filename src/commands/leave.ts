import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import CommandMusic from "./music_utils/commandMusic";
import {VoiceConnection} from "@discordjs/voice";
import Track from "./music_utils/track";

export default class Leave implements Command {
    
    name: string = 'leave'
    description: string = 'Leave the voice channel'
    options: Array<string> = []
    
    constructor(public commandMusic: CommandMusic){}

    execute(message: Message | CommandInteraction) {
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const guildId: string = message.member.guild.id
            let track: Track | undefined = this.commandMusic.queue.get(guildId)
            if (!track) return;
            let voiceConnection: VoiceConnection | undefined = track.voiceConnection
            if (voiceConnection && voiceConnection.joinConfig.guildId === guildId){
                if (voiceConnection.joinConfig.channelId === message.member.voice.channel.id) {
                    this.commandMusic.stop(guildId)
                    message.reply('Bye Bye!')
                } else message.reply(`I'm not in the same voice channel as you`)

            } else message.reply(`I'm not in a voice channel`)

        } else {
            message.reply('You must be in a voice channel to use this command')
            return
        }

    }

}

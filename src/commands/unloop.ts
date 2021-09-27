import {Command} from "./command";
import {CommandInteraction, GuildMember, Message} from "discord.js";
import Queue from "../music/queue";
import {VoiceConnection} from "@discordjs/voice";
import MusicCommand from "./musicCommand";

export default class Unloop extends MusicCommand implements Command {

    name: string = 'unloop'
    description: string = 'unloop the song'
    options: Array<string> = []

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
                this.musicController.unloop(guildId)
                message.reply('Unlooped!')
            } else message.reply(`I'm not in the same voice channel as you`)

        } else {
            message.reply('You must be in a voice channel to use this command')
            return
        }
    }
}

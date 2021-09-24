import {Command} from "./command";
import CommandMusic from "./music_utils/commandMusic";
import {CommandInteraction, GuildMember, Message} from "discord.js";
import Track from "./music_utils/track";
import {VoiceConnection} from "@discordjs/voice";

export default class UnLoop implements Command {

    name: string = 'unloop'
    description: string = 'unloop the song'
    options: Array<string> = []

    constructor(public commandMusic: CommandMusic){}

    execute(message: Message | CommandInteraction) {
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const guildId: string = message.member.guild.id
            let track: Track | undefined = this.commandMusic.queue.get(guildId)
            if (!track) {
                message.reply(`I'm not in a voice channel`)
                return;
            }
            let voiceConnection: VoiceConnection = track!.voiceConnection
            if (voiceConnection.joinConfig.channelId === message.member.voice.channel.id) {
                this.commandMusic.unloop(guildId)
                message.reply('Unlooped!')
            } else message.reply(`I'm not in the same voice channel as you`)

        } else {
            message.reply('You must be in a voice channel to use this command')
            return
        }
    }
}

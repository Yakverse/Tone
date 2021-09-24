import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import CommandMusic from "./music_utils/commandMusic";
import Track from "./music_utils/track";

export default class Skip implements Command {

    name: string = 'skip'
    description: string = 'Skip a song'
    options: Array<string> = []

    constructor(public commandMusic: CommandMusic){}

    execute(message: Message | CommandInteraction) {
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const guildId: string = message.member.guild.id
            let track: Track | undefined = this.commandMusic.queue.get(guildId)
            if (!track) {
                message.reply(`I'm not in a voice channel`)
                return
            }
            if (track.voiceConnection.joinConfig.channelId === message.member.voice.channel.id) {
                this.commandMusic.skip(guildId)
                message.reply('Skipped')
            } else message.reply(`I'm not in the same voice channel as you`)

        }
    }
    
}

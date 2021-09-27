import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import Queue from "../music/queue";
import MusicCommand from "./musicCommand";

export default class Skip extends MusicCommand implements Command {

    name: string = 'skip'
    description: string = 'Skip a song'
    options: Array<string> = []

    execute(message: Message | CommandInteraction) {
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const guildId: string = message.member.guild.id
            let track: Queue | undefined = this.musicController.guilds.get(guildId)
            if (!track) {
                message.reply(`I'm not in a voice channel`)
                return
            }
            if (track.voiceConnection.joinConfig.channelId === message.member.voice.channel.id) {
                this.musicController.skip(guildId)
                message.reply('Skipped')
            } else message.reply(`I'm not in the same voice channel as you`)

        }
    }
    
}

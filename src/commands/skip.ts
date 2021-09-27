import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import MusicController from "../music/musicController";
import Queue from "../music/queue";

export default class Skip implements Command {

    name: string = 'skip'
    description: string = 'Skip a song'
    options: Array<string> = []

    constructor(public commandMusic: MusicController){}

    execute(message: Message | CommandInteraction) {
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const guildId: string = message.member.guild.id
            let track: Queue | undefined = this.commandMusic.guilds.get(guildId)
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

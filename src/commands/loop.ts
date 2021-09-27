import {Command} from "./command";
import MusicController from "../music/musicController";
import {CommandInteraction, GuildMember, Message} from "discord.js";
import Queue from "../music/queue";
import {VoiceConnection} from "@discordjs/voice";

export default class Loop implements Command {

    name: string = 'loop'
    description: string = 'loop the song'
    options: Array<string> = []

    constructor(public commandMusic: MusicController){}

    execute(message: Message | CommandInteraction) {
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const guildId: string = message.member.guild.id
            let track: Queue | undefined = this.commandMusic.guilds.get(guildId)
            if (!track) {
                message.reply(`I'm not in a voice channel`)
                return;
            }
            let voiceConnection: VoiceConnection = track!.voiceConnection
            if (voiceConnection.joinConfig.channelId === message.member.voice.channel.id) {
                this.commandMusic.loop(guildId)
                message.reply('Looping!')
            } else message.reply(`I'm not in the same voice channel as you`)

        } else {
            message.reply('You must be in a voice channel to use this command')
            return
        }
    }
}

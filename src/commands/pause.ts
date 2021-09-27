import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import MusicController from "../music/musicController";
import Queue from "../music/queue";

export default class Pause implements Command {

    name: string = 'pause'
    description: string = 'Pause the song'
    options: Array<string> = []

    commandMusic: MusicController

    constructor(commandMusic: MusicController){
        this.commandMusic = commandMusic
    }

    execute(message: Message | CommandInteraction)     {
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const guildId: string = message.member.guild.id
            let track: Queue | undefined = this.commandMusic.guilds.get(guildId)
            if (!track) return;
            if (!track.voiceConnection) {
                message.reply('I\'m not in a voice channel')
                return
            }

            track.audioPlayer.pause()
            message.reply('Paused')
        }
    }
}

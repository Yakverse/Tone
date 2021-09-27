import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import Queue from "../music/queue";
import MusicCommand from "./musicCommand";

export default class Pause extends MusicCommand implements Command {

    name: string = 'pause'
    description: string = 'Pause the song'
    options: Array<string> = []

    execute(message: Message | CommandInteraction)     {
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const guildId: string = message.member.guild.id
            let track: Queue | undefined = this.musicController.guilds.get(guildId)
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

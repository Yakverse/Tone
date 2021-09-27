import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import MusicController from "../music/musicController";
import Queue from "../music/queue";

export default class Skip implements Command {

    name: string = 'stop'
    description: string = 'Stop the song and clear queue'
    options: Array<string> = []

    constructor(public commandMusic: MusicController){}

    execute(message: Message | CommandInteraction) {
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const guildId: string = message.member.guild.id
            let track: Queue | undefined = this.commandMusic.guilds.get(guildId)
            if (!track) return;
            if (!track.voiceConnection) {
                message.reply('I\'m not in a voice channel')
                return
            }

            this.commandMusic.stop(guildId)
            message.reply('Stop')
        }
    }
    
}

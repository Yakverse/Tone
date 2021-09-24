import {CommandInteraction, GuildMember, Message} from "discord.js";
import { Command } from "./command";
import CommandMusic from "./music_utils/commandMusic";
import Track from "./music_utils/track";

export default class Skip implements Command {

    name: string = 'stop'
    description: string = 'Stop the song and clear queue'
    options: Array<string> = []

    constructor(public commandMusic: CommandMusic){}

    execute(message: Message | CommandInteraction) {
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const guildId: string = message.member.guild.id
            let track: Track | undefined = this.commandMusic.queue.get(guildId)
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

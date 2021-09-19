import { CommandInteraction, Message } from "discord.js";
import { Command } from "./command";
import CommandMusic from "./music_utils/commandMusic";

export default class Skip implements Command {

    name: string = 'skip'
    description: string = 'Skip a song'
    options: Array<string> = []
    commandMusic: CommandMusic

    constructor(commandMusic: CommandMusic){
        this.commandMusic = commandMusic
    }

    execute(message: Message | CommandInteraction) {
        if (!this.commandMusic.getVoiceConnection){
            message.reply('I\'m not in a voice channel')
            return
        }

        this.commandMusic.audioPlayer.stop()
        message.reply('Skipped')
    }
    
}
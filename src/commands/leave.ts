import { CommandInteraction, Message } from "discord.js";
import { Command } from "./command";
import CommandMusic from "./music_utils/commandMusic";

export default class Leave implements Command {
    
    name: string = 'leave'
    description: string = 'Leave the voice channel'
    options: Array<string> = []
    
    commandMusic: CommandMusic

    constructor(commandMusic: CommandMusic){
        this.commandMusic = commandMusic
    }

    execute(message: Message | CommandInteraction) {
        if (this.commandMusic.getVoiceConnection){
            this.commandMusic.stop()
            message.reply('Ok!')
        } else {
            message.reply('I\'m not on a voice channel')
        }
    }

}
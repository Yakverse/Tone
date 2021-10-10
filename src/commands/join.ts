import {Command} from "./command";
import {CommandInteraction, Message} from "discord.js";
import MusicCommand from "./musicCommand";

export default class Join extends MusicCommand implements Command{

    name: string = 'join';
    description: string = 'join a voice channel';
    options: Array<string> = [];

    execute(message: Message | CommandInteraction): void {
        this.musicController.join(message)
    }



}

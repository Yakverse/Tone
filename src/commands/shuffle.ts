import {Command} from "./command";
import {CommandInteraction, Message} from "discord.js";
import MusicCommand from "./musicCommand";
import SucessEmbed from "../embeds/sucessEmbed";

export default class Shuffle extends MusicCommand implements Command{

    static properties: CommandPropertiesInterface = {
        name: 'shuffle',
        description: 'shuffle the queue',
        aliases: ['shuffle']
    }

    execute(message: Message | CommandInteraction): void {
        this.musicController.shuffle(message)
        message.reply({embeds: [SucessEmbed.create('Shuffled! 🤪').build()]})
    }



}

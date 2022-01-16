import {Command} from "./command";
import {CommandInteraction, GuildMember, Message} from "discord.js";
import MusicCommand from "./musicCommand";
import SucessEmbed from "../embeds/sucessEmbed";
import {typeSlashCommand} from "../enumerations/typeSlashCommand.enum";
import { CommandPropertiesInterface } from "../interfaces/CommandProperties.interface";

export default class Loop extends MusicCommand implements Command {

    static properties: CommandPropertiesInterface = {
        name: 'loop',
        description: 'loop the song',
        options: [
            {
                name: 'number',
                type: typeSlashCommand.INTEGER,
                description: 'Number of times the queue will repeat',
                required: false
            }
        ],
        aliases: ['loop']
    }

    execute(message: Message | CommandInteraction, args: Array<string>) {
        if(message.member instanceof GuildMember){
            this.musicController.isInSameVoiceChannel(message);
            if (message instanceof Message) {
                if (parseInt(args[0])) this.musicController.loop(message, parseInt(args[0]));
                else this.musicController.loop(message, undefined);
            }
            else if (message.options.get('song')) {
                let number: number | undefined;
                if (!message.options.get('number')) number = undefined;
                else number = message.options.get('number')!.value as number;

                this.musicController.loop(message, number);
            }
            message.reply({embeds:[SucessEmbed.create("Looping!").build()]});
        }
    }
}



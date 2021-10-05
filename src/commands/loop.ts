import {Command} from "./command";
import {CommandInteraction, GuildMember, Message} from "discord.js";
import MusicCommand from "./musicCommand";
import MusicController from "../music/musicController";
import SucessEmbed from "../embeds/sucessEmbed";

export default class Loop extends MusicCommand implements Command {

    name: string = 'loop'
    description: string = 'loop the song'
    options: Array<string> = []

    execute(message: Message | CommandInteraction, args: Array<string>) {
        if(message.member instanceof GuildMember){
            MusicController.isInSameVoiceChannel(message);
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
            message.reply({embeds:[new SucessEmbed("Looping!").build()]});
        }
    }
}



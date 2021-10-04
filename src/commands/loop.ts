import {Command} from "./command";
import {CommandInteraction, GuildMember, Message} from "discord.js";
import Queue from "../music/queue";
import MusicCommand from "./musicCommand";
import {Embeds} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";
import Utils from "../utils/utils";

export default class Loop extends MusicCommand implements Command {

    name: string = 'loop'
    description: string = 'loop the song'
    options: Array<string> = []

    execute(message: Message | CommandInteraction, args: Array<string>) {
        if(message.member instanceof GuildMember){
            const guildId: string = message.member.guild.id;
            let track: Queue | undefined = this.musicController.guilds.get(guildId);
            Utils.isInSameVoiceChannel(track,message);
            if (message instanceof Message) {
                if (parseInt(args[0])) this.musicController.loop(guildId, parseInt(args[0]));
                else this.musicController.loop(guildId, undefined);
            }
            else if (message.options.get('song')) {
                let number: number | undefined;
                if (!message.options.get('number')) number = undefined;
                else number = message.options.get('number')!.value as number;

                this.musicController.loop(guildId, number);
            }
            let embed = new Embeds({
                hexColor: ColorsEnum.GREEN,
                description: `Looping!`,
            });
            message.reply({embeds:[embed.build()]});
        }
    }
}



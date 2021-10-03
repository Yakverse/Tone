import {CommandInteraction, GuildMember, Message} from "discord.js";
import {Command} from "./command";
import Queue from "../music/queue";
import MusicCommand from "./musicCommand";
import {Embeds} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";
import Utils from "../utils/utils";

export default class QueueCommand extends MusicCommand implements Command {

    name: string = 'Queue';
    description: string = 'Show the current music queue';
    options: Array<string>  = [];

    execute(message: Message | CommandInteraction): void{
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const guildId: string = message.member.guild.id
            let currQueue: Queue | undefined = this.musicController.guilds.get(guildId)
            if (currQueue){

                let currindex = currQueue.indexActualAudio;
                let musicQueue = currQueue.audiosInfo;
                let missingMusics = musicQueue.length - currindex;
                let iterator = missingMusics > 10 ? 10 : missingMusics;
                let text = "```";

                for (let i = 0; i < iterator; i++) {
                    let musInfo = musicQueue[currindex+i];
                    text += `${(currindex+i+1).toString()}. ${Utils.formatString(musInfo[0])} - ${musInfo[1]}\n`
                }
                text += "```"

                message.reply({content:text})
                return
            } else {
                let embed = new Embeds({
                    hexColor: ColorsEnum.RED,
                    description: "**There is no queue in this server**"
                })
                message.reply({embeds:[embed.build()]})
            }
        }
    }
}
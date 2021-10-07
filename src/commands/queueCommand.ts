import {CommandInteraction, GuildMember, Message, MessageActionRow, MessageButton} from "discord.js";
import {Command} from "./command";
import Queue from "../music/queue";
import MusicCommand from "./musicCommand";
import Utils from "../utils/utils";
import MusicController from "../music/musicController";
import BotNotInAVoiceChannel from "../errors/botNotInAVoiceChannel";

export default class QueueCommand extends MusicCommand implements Command {

    name: string = 'Queue';
    description: string = 'Show the current music queue';
    options: Array<string>  = [];

    execute(message: Message | CommandInteraction): void{
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const guildId: string = message.member.guild.id;
            let currQueue: Queue | undefined = MusicController.guilds.get(guildId);
            if (currQueue){

                // TODO make buttons work

                let currindex = currQueue.indexActualAudio;
                let musicQueue = currQueue.audiosInfo;
                let looping = currQueue.timesToPlay
                let totalLenght = currQueue.queueTime;

                // Bithack for faster floor operation
                // Force casts the float value into an int32_t
                let nPages = musicQueue.length/10>>0;
                let currPage = currindex/10>>0;
                let nMusicInCurrPage = nPages == currPage ? musicQueue.length % 10 : 10;

                let STRING_PADDING = "\xa0".repeat(currindex.toString().length + 3)
                let text = "```";
                for ( let i = 0; i < nMusicInCurrPage; i++) {
                    let musInfo = musicQueue[currPage*10+i];
                    if(i == currindex%10){
                        text += `${STRING_PADDING}⬐ current track\n`
                        text += `${(currPage*10+i+1).toString()}. ${Utils.formatString(musInfo[0])} - ${Utils.parseSecondsToISO(musInfo[1])}\n`;
                        text += `${STRING_PADDING}⬑ current track\n`
                    } else {
                        text += `${(i+1).toString()}. ${Utils.formatString(musInfo[0])} - ${Utils.parseSecondsToISO(musInfo[1])}\n`;
                    }
                }

                let row = new MessageActionRow();

                if(nPages >= 0){
                    if (currPage >= 0){
                        row.addComponents(
                            new MessageButton()
                                .setCustomId(`queuePrevious${currPage}`)
                                .setEmoji("◀")
                                .setStyle("SECONDARY"),
                            new MessageButton()
                                .setCustomId(`queueFirst${currPage}`)
                                .setEmoji("⏮")
                                .setStyle("SECONDARY"),
                        )
                    }
                    if (nPages >= currPage){
                        row.addComponents(
                            new MessageButton()
                                .setCustomId(`queueNext${currPage}`)
                                .setEmoji("▶")
                                .setStyle("SECONDARY"),
                            new MessageButton()
                                .setCustomId(`queueLast${currPage}`)
                                .setEmoji("⏭")
                                .setStyle("SECONDARY"),
                        )
                    }
                }

                text += `\n ${musicQueue.length} song${musicQueue.length != 1 ? "s" : ""} in queue | ${Utils.parseSecondsToISO(totalLenght)} total length | Loop: ${looping <= 1 ? "❌" : "✔"} `;
                text += "```";
                message.reply({content:text , components: [row]});
            } else {
                throw new BotNotInAVoiceChannel();
            }
        }
    }
}
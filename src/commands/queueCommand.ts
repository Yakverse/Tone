import {ButtonInteraction, CommandInteraction, GuildMember, Message, MessageActionRow, MessageButton} from "discord.js";
import {Command} from "./command";
import Queue from "../music/queue";
import MusicCommand from "./musicCommand";
import Utils from "../utils/utils";
import BotNotInAVoiceChannel from "../errors/botNotInAVoiceChannel";
import NoTracksInQueue from "../errors/NoTracksInQueue";

export default class QueueCommand extends MusicCommand implements Command {

    static properties: CommandPropertiesInterface = {
        name: 'queue',
        description: 'Show the current music queue',
        aliases: [ 'q', 'queue' ]
    }

    MUSICS_PER_PAGE: number = 10;

    execute(message: Message | CommandInteraction | ButtonInteraction): void{
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const guildId: string = message.member.guild.id;
            let currQueue: Queue | undefined = this.musicController.guilds.get(guildId);
            if (currQueue){
                if(!currQueue.size()){
                    throw new NoTracksInQueue;
                }
                const currindex: number = currQueue.indexActualAudio;
                // Bithack for faster floor operation
                // Force casts the float value into an int32_t
                const lastPage: number = (currQueue.size() - 1) / this.MUSICS_PER_PAGE >> 0;
                const currPage: number = this.getCurrPage(message,lastPage,currindex);
                const messageContent: string = this.getMessageContent(currQueue,lastPage,currPage,currindex);
                const actionRow: MessageActionRow = this.getActionRow(lastPage, currPage);
                if (!(message instanceof ButtonInteraction)){
                    message.reply({content:messageContent , components: [actionRow]});
                } else {
                    message.update({content:messageContent , components: [actionRow]});
                }
            } else {
                throw new BotNotInAVoiceChannel();
            }
        }
    }

    getMessageContent(currQueue:Queue,lastPage:number, currPage:number, currindex:number): string{
        let nMusicInCurrPage: number;
        if(lastPage == currPage){
            nMusicInCurrPage = (currQueue.size() % this.MUSICS_PER_PAGE) ? currQueue.size() % this.MUSICS_PER_PAGE : this.MUSICS_PER_PAGE
        } else {
            nMusicInCurrPage = this.MUSICS_PER_PAGE;
        }

        const isCurrentMusicInCurrentPage: boolean = currindex/this.MUSICS_PER_PAGE>>0 == currPage;
        const STRING_PADDING: string = "\xa0".repeat(currindex.toString().length + 3);

        // Maybe make a header in the future?

        // Body
        let text: string = "```";
        for ( let i = 0; i < nMusicInCurrPage; i++) {
            let musInfo: [string, string] = currQueue.audiosInfo[currPage*this.MUSICS_PER_PAGE+i];
            if(i == currindex%this.MUSICS_PER_PAGE && isCurrentMusicInCurrentPage ){
                text += `${STRING_PADDING}⬐ current track\n`;
                text += `${(currPage*this.MUSICS_PER_PAGE+i+1).toString()}. ${Utils.formatString(musInfo[0])} - ${musInfo[1]}\n`;
                text += `${STRING_PADDING}⬑ current track\n`;
            } else {
                text += `${(currPage*this.MUSICS_PER_PAGE+i+1).toString()}. ${Utils.formatString(musInfo[0])} - ${musInfo[1]}\n`;
            }
        }
        // Fotter
        text += `\n${currQueue.size()} Song${currQueue.size() != 1 ? "s" : ""} In Queue | ${Utils.parseSecondsToISO(currQueue.queueTime)} Total Length | Loop: ${currQueue.timesToPlay <= 1 ? "❌" : "✔"} | Page ${currPage+1}/${lastPage+1}`;
        text += "```";
        return text
    }

    getCurrPage(message:Message | CommandInteraction | ButtonInteraction, lastPage:number, currindex:number): number{
        let currPage:number = currindex/this.MUSICS_PER_PAGE>>0;
        if(message instanceof ButtonInteraction)
            switch (message.customId[1]) {
                case "P":
                    currPage = parseInt(message.customId.slice(2)) - 1;
                    if (currPage < 0)
                        currPage = 0;
                    break;
                case "F":
                    currPage = 0;
                    break;
                case "N":
                    currPage = parseInt(message.customId.slice(2)) + 1;
                    if (currPage > lastPage)
                        currPage = lastPage;
                    break;
                case "L":
                    currPage = lastPage;
                    console.log(currPage);
                    break;
                default:
                    throw new TypeError();
            }
        return currPage;
    }


    getActionRow(nPages: number, currPage: number): MessageActionRow {
        let row: MessageActionRow = new MessageActionRow();
        if(nPages >= 0){
            if (currPage >= 0){
                row.addComponents(
                    new MessageButton()
                        .setCustomId(`qF`)
                        .setEmoji("⏮")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId(`qP${currPage}`)
                        .setEmoji("◀")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId(`qN${currPage}`)
                        .setEmoji("▶")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId(`qL`)
                        .setEmoji("⏭")
                        .setStyle("SECONDARY"),
                )
            }
        }
        return row;
    }
}

import {joinVoiceChannel, VoiceConnection} from "@discordjs/voice"
import Audio from "./audio";
import Queue from "./queue";
import {ButtonInteraction, CommandInteraction, GuildMember, Message} from "discord.js";
import UserNotInAVoiceChannel from "../errors/userNotInAVoiceChannel";
import BotNotInAVoiceChannel from "../errors/botNotInAVoiceChannel";
import UserInWrongChannel from "../errors/userInWrongChannel";
import {Embeds} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";
import {SearchInfoDTO} from "../dto/SearchInfoDTO";
import { VideoTypes } from "../enumerations/videoType.enum";

export default class MusicController {

    guilds: Map<string, Queue> = new Map<string, Queue>();

    getQueue(guildId: string): Queue{
        const queue: Queue | undefined = this.guilds.get(guildId)
        if (queue) return queue;
        throw new BotNotInAVoiceChannel();
    }

    getOptionalQueue(guildId: string): Queue | undefined{
        const queue: Queue | undefined = this.guilds.get(guildId)
        if (queue) return queue;
        return undefined
    }

    configGuildQueue(voiceConnection: VoiceConnection, guildId: string, message: Message | CommandInteraction){

        let queue: Queue | undefined = this.guilds.get(guildId)
        if (!queue) queue = this.guilds.set(guildId, new Queue(voiceConnection, message)).get(guildId)

        queue!.addListener()
    }
    
    pause(message: Message | CommandInteraction){
        this.isInSameVoiceChannel(message)
        this.getQueue(message.guildId!).pause();
    }

    resume(message: Message | CommandInteraction){
        this.isInSameVoiceChannel(message)
        this.getQueue(message.guildId!).resume();
    }

    // TODO remove leave from MusicController
    leave(message: Message | CommandInteraction | null, guildId: string | undefined = undefined){
        if (message) {
            this.isInSameVoiceChannel(message)
            this.getQueue(message.guildId!).leave();
            this.guilds.delete(message.guildId!);
        } else if (guildId) {
            this.getQueue(guildId).leave();
            this.guilds.delete(guildId);
        }
    }

    leaveAssert(guildId: string){
        const queue = this.getOptionalQueue(guildId)
        if (queue) queue.leave()
        this.guilds.delete(guildId);
    }

    stop(message: Message | CommandInteraction){
        this.isInSameVoiceChannel(message)
        this.getQueue(message.guildId!).stop()
    }

    skip(message: Message | CommandInteraction){
        this.isInSameVoiceChannel(message)
        this.getQueue(message.guildId!).skip()
    }

    async addQueue(guildId: string, videoInfo: SearchInfoDTO, message: Message | null){
        const queue: Queue = this.getQueue(guildId)

        if (message) queue.message = message

        if (videoInfo.type === VideoTypes.YOUTUBE_VIDEO || videoInfo.type === VideoTypes.SOUNDCLOUD)
            queue.addAudio(new Audio(videoInfo));
        else // For now it's not necessary to check if it's a playlist.
            for (let video of videoInfo.videos!)
                queue.addAudio(new Audio(video));

        await queue.processQueue(true);
    }

    loop(message: Message | CommandInteraction, number: number | undefined){
        this.isInSameVoiceChannel(message)
        const queue: Queue = this.getQueue(message.guildId!)
        if (!queue.actualAudio) return
        queue.loop(number)
    }

    unloop(message: Message | CommandInteraction){
        this.isInSameVoiceChannel(message);
        const queue: Queue = this.getQueue(message.guildId!)
        if (!queue.actualAudio) return
        queue.unloop()
    }

    join(message: Message | CommandInteraction){
        this.isInAVoiceChannel(message)
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const channel = message.member.voice.channel
            const track: Queue | undefined = this.guilds.get(channel.guildId)
            if (track) {
                if (track.voiceConnection.joinConfig.channelId != channel.id) {
                    let embed = new Embeds({
                        hexColor: ColorsEnum.RED,
                        description: `Sorry, I'm in OTHER channel with OTHER friends now`,
                    });
                    message.reply({embeds: [embed.build()]});
                    return;
                }

            } else {
                this.configGuildQueue(
                    joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator
                    }),
                    channel.guildId,
                    message
                )
            }
        }
    }

    public isInAVoiceChannel(message: Message | CommandInteraction | ButtonInteraction){
        if (!(message.member instanceof GuildMember) || !message.member.voice.channel) throw new UserNotInAVoiceChannel();
    }

    public isInSameVoiceChannel(message: Message | CommandInteraction | ButtonInteraction): void{
        let track: Queue | undefined = this.guilds.get(message.guildId!);

        if (!(message.member instanceof GuildMember)){
            // Not in a guild chat
            return
        }

        if (!message.member.voice.channel)
            throw new UserNotInAVoiceChannel();

        if (!track){
            throw new BotNotInAVoiceChannel();
        } else {
            if (!track.voiceConnection) {
                throw new BotNotInAVoiceChannel();
            }

            if(track.voiceConnection.joinConfig.channelId != message.member.voice.channel.id){
                throw new UserInWrongChannel();
            }
        }
    }
}

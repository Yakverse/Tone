import {joinVoiceChannel, VoiceConnection} from "@discordjs/voice";
import { videoInfo } from 'ytdl-core';
import Audio from "./audio";
import Queue from "./queue";
import {ButtonInteraction, CommandInteraction, GuildMember, Message} from "discord.js";
import UserNotInAVoiceChannel from "../errors/userNotInAVoiceChannel";
import BotNotInAVoiceChannel from "../errors/botNotInAVoiceChannel";
import UserInWrongChannel from "../errors/userInWrongChannel";
import {Embeds} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";

export default class MusicController {

    static guilds: Map<string, Queue> = new Map<string, Queue>();

    private static getQueue(guildId: string): Queue{
        const queue: Queue | undefined = MusicController.guilds.get(guildId)
        if (queue) return queue;
        throw new BotNotInAVoiceChannel();
    }

    configGuildQueue(voiceConnection: VoiceConnection, guildId: string, message: Message | CommandInteraction){

        let queue: Queue | undefined = MusicController.guilds.get(guildId)
        if (!queue) queue = MusicController.guilds.set(guildId, new Queue(voiceConnection, message)).get(guildId)

        queue!.addListener()
    }
    
    pause(message: Message | CommandInteraction){
        MusicController.isInSameVoiceChannel(message)
        MusicController.getQueue(message.guildId!).pause();
    }

    resume(message: Message | CommandInteraction){
        MusicController.isInSameVoiceChannel(message)
        MusicController.getQueue(message.guildId!).resume();
    }

    leave(message: Message | CommandInteraction){
        MusicController.isInSameVoiceChannel(message)
        MusicController.getQueue(message.guildId!).leave();
        MusicController.guilds.delete(message.guildId!);
    }

    stop(message: Message | CommandInteraction){
        MusicController.isInSameVoiceChannel(message)
        MusicController.getQueue(message.guildId!).stop()
    }

    skip(message: Message | CommandInteraction){
        MusicController.isInSameVoiceChannel(message)
        MusicController.getQueue(message.guildId!).skip()
    }

    async addQueue(guildId: string, videoInfo: videoInfo, message: Message | null){
        const queue: Queue = MusicController.getQueue(guildId)

        if (message)
            queue.updateMessage(message);

        queue.addAudio(new Audio(videoInfo));
        await queue.processQueue();
    }

    loop(message: Message | CommandInteraction, number: number | undefined){
        MusicController.isInSameVoiceChannel(message)
        const queue: Queue = MusicController.getQueue(message.guildId!)
        if (!queue.actualAudio) return
        queue.loop(number)
    }

    unloop(message: Message | CommandInteraction){
        MusicController.isInSameVoiceChannel(message);
        const queue: Queue = MusicController.getQueue(message.guildId!)
        if (!queue.actualAudio) return
        queue.unloop()
    }

    join(message: Message | CommandInteraction){
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const channel = message.member.voice.channel
            const track: Queue | undefined = MusicController.guilds.get(channel.guildId)
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
        } else {
            let embed = new Embeds({
                hexColor: ColorsEnum.RED,
                description: '**You must be in a voice channel to use this command**',
            })
            message.reply({embeds: [embed.build()]})
            return
        }
    }


    public static isInSameVoiceChannel(message: Message | CommandInteraction | ButtonInteraction): void{
        let track: Queue | undefined = MusicController.guilds.get(message.guildId!);

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

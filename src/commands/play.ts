import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import {CommandInteraction, GuildMember, Message, StageChannel, VoiceChannel} from "discord.js";
import { Command } from "./command";
import CommandMusic from "./music_utils/commandMusic";
import {getBasicInfo, validateURL, videoInfo} from 'ytdl-core';
import Track from "./music_utils/track";
import axios from "axios";
import { environment } from "../environments/environment";

export default class Play implements Command {

    name: string = 'play'
    description: string = 'Play a song'
    options: Array<string> = []

    constructor(public commandMusic: CommandMusic){}

    execute(message: Message | CommandInteraction, args: Array<string>) {
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const channel = message.member.voice.channel
            let url: Array<string> | string = ''
            if (message instanceof Message) { url = args }
            else if (message.options.get('song')) { url = message.options.get('song')!.value as string}

            this.process(message, channel, url)

        } else {
            message.reply('You must be in a voice channel to use this command')
            return
        }
    }

    private async process(message: Message | CommandInteraction, channel: VoiceChannel | StageChannel, url: string | Array<string>) {
        if (url.length === 0){
            await message.reply('Invalid URL')
            return
        }

        if (!(message instanceof CommandInteraction))
            message = await message.reply(`Searching ${url[0]}`)
        else await message.reply(`Searching ${url[0]}`)
        
        if (!validateURL(url[0])) {
            if (url instanceof Array)
                url = [url.join(' ')]
            else url = [url]

            url = [
                (await axios.get(`${environment.ytdSearchURL}${url[0].replace(' ', '%20')}`))
                    .data.data[0].url
            ]
        }

        const track: Track | undefined = this.commandMusic.queue.get(channel.guildId)
        if (track) {
            let voiceConnection: VoiceConnection = track.voiceConnection

            if (voiceConnection.joinConfig.channelId != channel.id) {
                await message.reply(`Sorry, I'm in OTHER channel with OTHER friends now`)
                return;
            }

        } else {
            this.commandMusic.setVoiceConnection(
                joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator
                }),
                channel.guildId,
                message
            )
        }

        const info: videoInfo = await getBasicInfo(url[0])
        if (!(message instanceof CommandInteraction)) await message.edit(`${info.videoDetails.title} Added to queue`)
        else await message.editReply(`${info.videoDetails.title} Added to queue`)
        await this.commandMusic.addQueue(channel.guildId, info)
    }

}
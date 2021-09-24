import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import {CommandInteraction, GuildMember, Message, StageChannel, VoiceChannel} from "discord.js";
import { Command } from "./command";
import CommandMusic from "./music_utils/commandMusic";
import {getBasicInfo, validateURL, videoInfo} from 'ytdl-core';
import Track from "./music_utils/track";

export default class Play implements Command {

    name: string = 'play'
    description: string = 'Play a song'
    options: Array<string> = []

    constructor(public commandMusic: CommandMusic){}

    execute(message: Message | CommandInteraction, args: Array<string>) {
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const channel = message.member.voice.channel
            let url: string | null = null
            if (message instanceof Message) { url = args[0] }
            else if (message.options.get('song')) { url = message.options.get('song')!.value as string}

            this.process(message, channel, url)

        } else {
            message.reply('You must be in a voice channel to use this command')
            return
        }
    }

    private async process(message: Message | CommandInteraction, channel: VoiceChannel | StageChannel, url: string | null) {
        if (!url || !validateURL(url)) {
            await message.reply('Invalid URL')
            return
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
                channel.guildId
            )
        }

        const info: videoInfo = await getBasicInfo(url)
        await message.reply(`${info.videoDetails.title} Added to queue`)
        await this.commandMusic.addQueue(channel.guildId, info)
    }

}

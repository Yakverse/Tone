import {AudioPlayerStatus, joinVoiceChannel, VoiceConnection} from "@discordjs/voice";
import {CommandInteraction, GuildMember, Message, StageChannel, VoiceChannel} from "discord.js";
import { Command } from "./command";
import CommandMusic from "./music_utils/commandMusic";
import {MoreVideoDetails, validateURL} from 'ytdl-core';
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

    private process(message: Message | CommandInteraction, channel: VoiceChannel | StageChannel, url: string | null): void{
        if (!url || !validateURL(url)) {
            message.reply('Invalid URL')
            return
        }
        const track: Track | undefined = this.commandMusic.queue.get(channel.guildId)
        let addedToQueue: boolean = false
        if (track) {
            let voiceConnection: VoiceConnection = track.voiceConnection

            if (voiceConnection.joinConfig.channelId === channel.id) {
                if (track.audioPlayer.state.status === AudioPlayerStatus.Playing) addedToQueue = true
            } else {
                message.reply(`Sorry, I'm in OTHER channel with OTHER friends now`)
                return;
            }

        }
        else {
            this.commandMusic.setVoiceConnection(
                joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator
                }),
                channel.guildId
            )
        }

        this.commandMusic.addQueue(channel.guildId, url).then((video: MoreVideoDetails) => {
                if (addedToQueue) message.reply(`${video.title} Added to queue`)
                else message.reply(`Playing ${video.title}`)
        })
    }

}

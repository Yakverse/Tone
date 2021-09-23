import { AudioPlayerStatus, joinVoiceChannel } from "@discordjs/voice";
import {CommandInteraction, GuildMember, Message, StageChannel, VoiceChannel} from "discord.js";
import { Command } from "./command";
import CommandMusic from "./music_utils/commandMusic";
import {validateURL} from 'ytdl-core';

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

        let addedToQueue: boolean = false
        if (this.commandMusic.getVoiceConnection){
            if (this.commandMusic.getVoiceConnection.joinConfig.channelId === channel.id){
                if (this.commandMusic.audioPlayer.state.status === AudioPlayerStatus.Playing) addedToQueue = true
            } else{
                message.reply(`Sorry, I'm in OTHER channel with OTHER friends now`)
                return;
            }

        }
        else {
            this.commandMusic.setVoiceConnection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator
            })
        }

        this.commandMusic.addQueue(url).then((video: string) => {
            if (addedToQueue) message.reply(`${video} Added to queue`)
            else message.reply(`Playing ${video}`)
        })
    }

}

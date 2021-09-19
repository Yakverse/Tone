import { joinVoiceChannel } from "@discordjs/voice";
import { CommandInteraction, GuildMember, Message } from "discord.js";
import { Command } from "./command";
import CommandMusic from "./music_utils/commandMusic";

export default class Play implements Command {

    name: string = 'play'
    description: string = 'Play a song'
    options: Array<string> = []
    commandMusic: CommandMusic

    constructor(commandMusic: CommandMusic){
        this.commandMusic = commandMusic
    }

    execute(message: Message | CommandInteraction, args: Array<string>) {
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const channel = message.member.voice.channel
            let url: string | null = null
            if (message instanceof Message) { url = args[0] }
            else if (message.options.get('song')) { url = message.options.get('song')!.value as string}
            else {
                message.reply('Invalid URL')
                return
            }

            if (!url) {
                message.reply('Invalid URL')
                return
            }

            if (this.commandMusic.getVoiceConnection) {
                this.commandMusic.addQueue(url)
                if (this.commandMusic.queue.length !== 0) message.reply('Added to queue')
                else message.reply('Playing')
                return
            }

            this.commandMusic.setVoiceConnection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator
            })


            this.commandMusic.addQueue(url)
            message.reply(`Playing`)

        } else {
            message.reply('You must be in a voice channel to use this command')
            return
        }
    }

}
import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import {CommandInteraction, GuildMember, Message, StageChannel, VoiceChannel} from "discord.js";
import { Command } from "./command";
import {getBasicInfo, validateURL, videoInfo} from 'ytdl-core';
import Queue from "../music/queue";
import axios from "axios";
import { environment } from "../environments/environment";
import MusicCommand from "./musicCommand";
import {Embeds} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";

export default class Play extends MusicCommand implements Command {

    name: string = 'play'
    description: string = 'Play a song'
    options: Array<string> = []

    execute(message: Message | CommandInteraction, args: Array<string>) {
        if (message.member instanceof GuildMember && message.member.voice.channel) {
            const channel = message.member.voice.channel
            let url: Array<string> | string = ''
            if (message instanceof Message) { url = args }
            else if (message.options.get('song')) { url = message.options.get('song')!.value as string}
            this.process(message, channel, url)

        } else {
            let embed = new Embeds({
                hexColor: ColorsEnum.RED,
                description: '**You must be in a voice channel to use this command**',
            })
            message.reply({embeds: [embed.build()]})
            return
        }
    }

    private async process(message: Message | CommandInteraction, channel: VoiceChannel | StageChannel, url: string | Array<string>) {
        if (url.length === 0){
            let embed = new Embeds({
                hexColor: ColorsEnum.RED,
                description: '**Invalid URL**',
            });
            await message.reply({embeds: [embed.build()]})
            return
        }

        if (!(message instanceof CommandInteraction)){
            let embed = new Embeds({
                hexColor: ColorsEnum.YELLOW,
                description: `**🎵 Searching 🔎 ${url[0]}**`,
            });
            message = await message.reply({embeds: [embed.build()]})

        }
        else{
            let embed = new Embeds({
                hexColor: ColorsEnum.YELLOW,
                description: `**🎵 Searching 🔎 ${url[0]}**`,
            });
            await message.reply({embeds: [embed.build()]})
        }

        if (!validateURL(url[0])) {
            if (url instanceof Array)
                url = [url.join(' ')]
            else url = [url]

            url = [
                (await axios.get(`${environment.ytdSearchURL}${url[0].replace(' ', '%20')}`))
                    .data.data[0].url
            ]
        }

        const track: Queue | undefined = this.musicController.guilds.get(channel.guildId)
        if (track) {
            let voiceConnection: VoiceConnection = track.voiceConnection

            if (voiceConnection.joinConfig.channelId != channel.id) {
                let embed = new Embeds({
                    hexColor: ColorsEnum.RED,
                    description: `Sorry, I'm in OTHER channel with OTHER friends now`,
                });
                await message.reply({embeds: [embed.build()]});
                return;
            }

        } else {
            this.musicController.configGuildQueue(
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

        let embed = new Embeds({
            hexColor: ColorsEnum.GRAY,
            description: `${info.videoDetails.title} Added to queue`,
        })

        if (!(message instanceof CommandInteraction)){
            await message.edit({embeds:[embed.build()]})
        }
        else await message.editReply({embeds:[embed.build()]})
        await this.musicController.addQueue(channel.guildId, info)
    }

}

import { joinVoiceChannel} from "@discordjs/voice";
import {CommandInteraction, GuildMember, Message, StageChannel, VoiceChannel} from "discord.js";
import { Command } from "./command";
import {getBasicInfo, validateURL} from 'ytdl-core';
import Queue from "../music/queue";
import axios from "axios";
import { environment } from "../environments/environment";
import MusicCommand from "./musicCommand";
import {Embeds} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";
import MusicController from "../music/musicController";
import App from "../main";
import { LogTypeEnum } from "../enumerations/logType.enum";

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
                description: '**Invalid music**',
            });
            await message.reply({embeds: [embed.build()]})
            return
        }

        if (url instanceof Array) url = [url.join(' ')]
        else url = [url]

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
            url = [
                (await axios.get(`${environment.ytdSearchURL}${url[0].replace(' ', '%20')}`))
                    .data.data[0].url
            ]
        }

        const track: Queue | undefined = MusicController.guilds.get(channel.guildId)
        if (track) {
            if (track.voiceConnection.joinConfig.channelId != channel.id) {
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

        // TODO fix bug where bot cant parse a video that is age restricted this try catch was made so the bot doesnt crash
        try {
            let info = await getBasicInfo(url[0])
            let embed = new Embeds({
                hexColor: ColorsEnum.GRAY,
                description: `${info.videoDetails.title} Added to queue`,
            })

            if (!(message instanceof CommandInteraction)){
                await message.edit({embeds:[embed.build()]})
                await this.musicController.addQueue(channel.guildId, info, message)
            }
            else{
                await message.editReply({embeds:[embed.build()]})
                await this.musicController.addQueue(channel.guildId, info, null)
            }
        } catch (e : unknown){
            App.logger.send(LogTypeEnum.ERROR, "Bot failed to parse, probably it is and adult video");
            await message.reply("Something went very wrong")
        }
    }
}
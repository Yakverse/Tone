import {CommandInteraction, Message} from "discord.js";
import { Command } from "./command";
import MusicCommand from "./musicCommand";
import {Embed} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";
import MusicSearch from "../music/musicSearch";
import App from "../main";
import {LogTypeEnum} from "../enumerations/logType.enum";
import { VideoTypes } from "../enumerations/videoType.enum";
import {typeSlashCommand} from "../enumerations/typeSlashCommand.enum";
import {ErrorEmbed} from "../embeds/errorEmbed";
import { CommandPropertiesInterface } from "../interfaces/CommandProperties.interface";

export default class Play extends MusicCommand implements Command {

    static properties: CommandPropertiesInterface = {
        name: 'play',
        description: 'Play a song',
        options: [
            {
                name: 'song',
                type: typeSlashCommand.STRING,
                description: 'URL or name of the song',
                required: true
            }
        ],
        aliases: ['play', 'p']
    }

    execute(message: Message | CommandInteraction, args: Array<string>) {
        this.musicController.join(message)
        let url: Array<string> | string = ''
        if (message instanceof Message) { url = args }
        else if (message.options.get('song')) { url = message.options.get('song')!.value as string}
        this.process(message, url)
    }

    private async process(message: Message | CommandInteraction, url: string | Array<string>) {
        if (url.length === 0){
            let embed = ErrorEmbed.create('**Invalid music**')
            await message.reply({embeds: [embed.build()]})
            return
        }

        if (Array.isArray(url)) url = [url.join(' ')]
        else url = [url]

        let searchEmbed = Embed.create(`**🎵 Searching 🔎 ${url[0]}**`, ColorsEnum.YELLOW)
        if (!(message instanceof CommandInteraction))
            message = await message.reply({embeds: [searchEmbed.build()]})
        else
            await message.reply({embeds: [searchEmbed.build()]})

        const info = await MusicSearch.search(url[0]).catch(async error => {
            let embed = ErrorEmbed.create(error.message)
            App.logger.send(LogTypeEnum.ERROR, `${error}`)
            if (!(message instanceof CommandInteraction)) 
                await message.edit({embeds:[embed.build()]})
            else 
                await message.editReply({embeds:[embed.build()]})
        })
        if (!info) return

        let embedMessage
        if (info.type === VideoTypes.YOUTUBE_VIDEO || info.type === VideoTypes.SOUNDCLOUD || info.type === VideoTypes.SPOTIFY)
            embedMessage = `🎶 Added to queue`
        else
            embedMessage = `🎶 Added ${info.length} songs queue`

        let embed = Embed.create(embedMessage, ColorsEnum.WHITE, `${info.title}`)
        embed.options.thumbnail = info.thumbnail

        if (!(message instanceof CommandInteraction)) {
            await message.edit({embeds:[embed.build()]})
            await this.musicController.addQueue(message.guildId!, info, message)
        }
        else {
            await message.editReply({embeds:[embed.build()]})
            await this.musicController.addQueue(message.guildId!, info, null)
        }
    }
}

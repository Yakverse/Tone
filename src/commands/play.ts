import {CommandInteraction, Message} from "discord.js";
import { Command } from "./command";
import MusicCommand from "./musicCommand";
import {Embeds} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";
import MusicSearch from "../music/musicSearch";
import App from "../main";
import {LogTypeEnum} from "../enumerations/logType.enum";
import { VideoTypes } from "../enumerations/videoType.enum";

export default class Play extends MusicCommand implements Command {

    static properties: CommandPropertiesInterface = {
        name: 'play',
        description: 'Play a song',
        options: [],
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

        const info = await MusicSearch.search(url[0]).catch(async error => {
            let embed = new Embeds({
                hexColor: ColorsEnum.RED,
                title: `Error`,
                description: error.name
            })
            console.log(error)
            App.logger.send(LogTypeEnum.ERROR, `${error}`)
            if (!(message instanceof CommandInteraction)) 
                await message.edit({embeds:[embed.build()]})
            else 
                await message.editReply({embeds:[embed.build()]})
        })
        if (!info) return

        let embed
        if (info.type === VideoTypes.YOUTUBE_VIDEO || info.type === VideoTypes.SOUNDCLOUD){
            embed = new Embeds({
                hexColor: ColorsEnum.WHITE,
                title: `🎶 Added to queue`,
                description: `${info.title}`
            })
            embed.options.thumbnail = info.thumbnail
        } else { // For now it's not necessary to check if it's a playlist.
            embed = new Embeds({
                hexColor: ColorsEnum.WHITE,
                title: `🎶 Added ${info.length} songs queue`,
                description: `${info.title}`,
            })
            embed.options.thumbnail = info.thumbnail
        }

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

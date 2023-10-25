// export default class Play extends MusicCommand implements Command {

import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ColorsEnum } from "@/enumerations/colors.enum";
import musicController from "@/music/musicController";

//     static properties: CommandPropertiesInterface = {
//         name: 'play',
//         description: 'Play a song',
//         options: [
//             {
//                 name: 'song',
//                 type: typeSlashCommand.STRING,
//                 description: 'URL or name of the song',
//                 required: true
//             }
//         ],
//         aliases: ['play', 'p']
//     }

//     execute(message: Message | CommandInteraction, args: Array<string>) {
//         this.musicController.join(message)
//         let url: Array<string> | string = ''
//         if (message instanceof Message) { url = args }
//         else if (message.options.get('song')) { url = message.options.get('song')!.value as string}
//         this.process(message, url)
//     }

//     private async process(message: Message | CommandInteraction, url: string | Array<string>) {
//         if (url.length === 0){
//             let embed = ErrorEmbed.create('**Invalid music**')
//             await message.reply({embeds: [embed.build()]})
//             return
//         }

//         if (Array.isArray(url)) url = [url.join(' ')]
//         else url = [url]

//         let searchEmbed = Embed.create(`**🎵 Searching 🔎 ${url[0]}**`, ColorsEnum.YELLOW)
//         if (!(message instanceof CommandInteraction))
//             message = await message.reply({embeds: [searchEmbed.build()]})
//         else
//             await message.reply({embeds: [searchEmbed.build()]})

//         const info = await MusicSearch.search(url[0]).catch(async error => {

//             let embed: Embed
//             switch(error.message) {
//                 case "MUSIC_NOT_FOUND":
//                     embed = ErrorEmbed.create('**Music not found**'); break;
//                 case "PLAYLIST_ALBUM_NOT_SUPPORTED":
//                     embed = ErrorEmbed.create('**Playlist and Albums are not supported yet**'); break;
//                 case "PLAYLIST_LIMIT":
//                     embed = ErrorEmbed.create('**Playlist limit reached**'); break;
//                 case "YOUTUBE_BLOCK":
//                     embed = ErrorEmbed.create("**Youtube has blocked our servers (we can't play music from Spotify either).\n\n We'll be back soon!**"); break;
//                 default:
//                     embed = ErrorEmbed.create("There was an error searching for this song. It may be blocked in some countries or age restricted.")
//             }

//             App.logger.send(LogTypeEnum.ERROR, `${error}`)
//             if (!(message instanceof CommandInteraction)) 
//                 await message.edit({embeds:[embed.build()]})
//             else 
//                 await message.editReply({embeds:[embed.build()]})
//         })
//         if (!info) return

//         let embedMessage
//         if (info.type === VideoTypes.YOUTUBE_VIDEO || info.type === VideoTypes.SOUNDCLOUD || info.type === VideoTypes.SPOTIFY)
//             embedMessage = `🎶 Added to queue`
//         else
//             embedMessage = `🎶 Added ${info.length} songs queue`

//         let embed = Embed.create(embedMessage, ColorsEnum.WHITE, `${info.title}`)
//         embed.options.thumbnail = info.thumbnail

//         if (!(message instanceof CommandInteraction)) {
//             await message.edit({embeds:[embed.build()]})
//             await this.musicController.addQueue(message.guildId!, info, message)
//         }
//         else {
//             await message.editReply({embeds:[embed.build()]})
//             await this.musicController.addQueue(message.guildId!, info, null)
//         }
//     }
// }

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('play a song')
        .addStringOption(option => option.setName('song').setDescription('URL or name of the song').setRequired(true)),
    async execute(interaction: CommandInteraction) {

        try {
            musicController.play(interaction)
        } catch(err: any) {
            const embed = new EmbedBuilder()
                .setTitle(`**${err.message}**`)
                .setColor(ColorsEnum.RED)
            
            return await interaction.reply({embeds: [embed], ephemeral: true})
        }

        const embed = new EmbedBuilder()
            .setTitle("**Playing**")
            .setColor(ColorsEnum.GREEN)

        await interaction.reply({embeds: [embed]})
        
    }
}

import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ColorsEnum } from "@/enumerations/colors.enum";
import musicController from "@/music/musicController";
export default {
    data: new SlashCommandBuilder()
        .setName('unloop')
        .setDescription('unloop the song'),
    async execute(interaction: CommandInteraction) {

        try {
            musicController.unloop(interaction)
        } catch(err: any) {
            const embed = new EmbedBuilder()
                .setTitle(`**${err.message}**`)
                .setColor(ColorsEnum.RED)
            
            return await interaction.reply({embeds: [embed], ephemeral: true})
        }

        const embed = new EmbedBuilder()
            .setTitle("**Unlooped!**")
            .setColor(ColorsEnum.GREEN)

        await interaction.reply({embeds: [embed]})

    }
}

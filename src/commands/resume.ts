import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ColorsEnum } from "@/enumerations/colors.enum";
import musicController from "@/music/musicController";

export default {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('resume the song'),
    async execute(interaction: CommandInteraction) {

        try {
            musicController.resume(interaction)
        } catch(err: any) {
            const embed = new EmbedBuilder()
                .setTitle(`**${err.message}**`)
                .setColor(ColorsEnum.RED)
            
            return await interaction.reply({embeds: [embed], ephemeral: true})
        }

        const embed = new EmbedBuilder()
            .setTitle("**Resume**")
            .setColor(ColorsEnum.GREEN)

        await interaction.reply({embeds: [embed]})

    }
}

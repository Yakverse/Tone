import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ColorsEnum } from "@/enumerations/colors.enum";
import musicController from "@/music/musicController";

export default {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('stop the song and clear queue'),
    async execute(interaction: CommandInteraction) {

        try {
            musicController.stop(interaction)
        } catch(err: any) {
            const embed = new EmbedBuilder()
                .setTitle(`**${err.message}**`)
                .setColor(ColorsEnum.RED)
            
            return await interaction.reply({embeds: [embed], ephemeral: true})
        }

        const embed = new EmbedBuilder()
            .setTitle("**Stopped**")
            .setColor(ColorsEnum.GREEN)

        await interaction.reply({embeds: [embed]})

    }
}

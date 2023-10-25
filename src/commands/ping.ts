import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { ColorsEnum } from "@/enumerations/colors.enum";
import App from "@/main";

export default {
    data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('test ping'),
	async execute(interaction: CommandInteraction) {
		const calculatingEmbed = new EmbedBuilder()
			.setTitle('**Ping  🏓**')
			.setColor(ColorsEnum.YELLOW)
			.setDescription('🧠 Calculating...')
		
        await interaction.reply({ embeds: [calculatingEmbed] });

		const finalEmbed = new EmbedBuilder()
			.setTitle('**Pong  🏓**')
			.setColor(ColorsEnum.WHITE)
			.setFields(
				{ name: '🤖', value: '<:discord:894070912519917639>', inline: true },
				{ name: `**${Date.now() - interaction.createdTimestamp}ms**`, value: `**${App.bot.client.ws.ping}ms**`, inline: true },
			)

		await interaction.editReply({ embeds: [finalEmbed] })
	}
}

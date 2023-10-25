// export default class Invite implements Command{

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ColorsEnum } from "@/enumerations/colors.enum";
import { BOT } from "@/utils/constants";

export default {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('invite me to your discord server'),
    async execute(interaction: CommandInteraction) {

        const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
                    .setURL(BOT.INVITE_URL)
                    .setEmoji("✉")
                    .setStyle(ButtonStyle.Link)
            )
        
        const embed = new EmbedBuilder()
            .setTitle('**Invite Me**')
            .setColor(ColorsEnum.WHITE)
            .setImage('https://imgur.com/l9e0S1s.jpg')
            .setURL(BOT.INVITE_URL)

        await interaction.reply({ embeds: [embed], components: [row as any] });

    }
}

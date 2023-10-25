import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ColorsEnum } from "@/enumerations/colors.enum";
import App from "@/main";

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('need some help? wanna know the commands?'),
    async execute(interaction: CommandInteraction) {

        const commands = []
        for (const commandNames of Array.from(App.bot.client.commands.keys())) {
            const command = App.bot.client.commands.get(commandNames)
            commands.push(`${command.data.name} | ${command.data.description}\n`)
        }

        const embed = new EmbedBuilder()
            .setTitle('**Commands**')
            .setColor(ColorsEnum.GRAY)
            .setDescription(`${"".concat(...commands)}`)

        await interaction.reply({ embeds: [embed] })
    }
}

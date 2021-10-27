import {Command} from "./command";
import {CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {environment} from "../environments/environment";
import {ColorsEnum} from "../enumerations/Colors.enum";

export default class Invite implements Command{

    static properties: CommandPropertiesInterface = {
        name: 'invite',
        description: 'invite me to your discord server',
        aliases: ['invite']
    }

    execute(message: Message | CommandInteraction) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setURL(environment.inviteURL)
                    .setEmoji("✉")
                    .setStyle('LINK')
            );

        const embed = new MessageEmbed()
            .setColor(ColorsEnum.WHITE)
            .setTitle('**Invite Me**')
            .setImage('https://imgur.com/l9e0S1s.jpg')
            .setURL(environment.inviteURL)

        message.reply({ components: [row], embeds: [embed] });
    }
}

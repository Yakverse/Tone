import {Command} from "./command";
import {CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {ColorsEnum} from "../enumerations/Colors.enum";
import { BOT } from "../utils/constants";
import { CommandPropertiesInterface } from "../interfaces/CommandProperties.interface";

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
                    .setURL(BOT.INVITE_URL)
                    .setEmoji("✉")
                    .setStyle('LINK')
            );

        const embed = new MessageEmbed()
            .setColor(ColorsEnum.WHITE)
            .setTitle('**Invite Me**')
            .setImage('https://imgur.com/l9e0S1s.jpg')
            .setURL(BOT.INVITE_URL)

        message.reply({ components: [row], embeds: [embed] });
    }
}

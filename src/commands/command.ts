import {ButtonInteraction, CommandInteraction, Message} from "discord.js";

export interface Command {

    execute(message: Message | CommandInteraction | ButtonInteraction, args: Array<string> | null): void

}

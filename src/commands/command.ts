import { CommandInteraction, Message } from "discord.js";

export interface Command {

    name: string
    description: string
    options: Array<string> | null

    execute(message: Message | CommandInteraction, args: Array<string> | null): void

}
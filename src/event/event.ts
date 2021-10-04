import {Client, CommandInteraction, Interaction, Message} from "discord.js";
import { CommandFactory } from "../commands/commandFactory";
import { environment } from "../environments/environment";
import BotError from "../errors/botError";
import {ErrorEmbed} from "../embeds/errorEmbed";

export class Event {

    commandFactory: CommandFactory = new CommandFactory()

    constructor(client: Client){
        client.on('messageCreate', (message: Message) => { this.onMessage(message) })
        client.on('interactionCreate', (interaction: Interaction) => { this.onInteraction(interaction) })
    }

    onMessage(message: Message): void {
        if (message.author.bot) return

        if (message.content.startsWith(environment.prefix)){
            let args: Array<string> = message.content.split(" ")

            let command: string = args[0].split(environment.prefix)[1]
            if (!command) return

            args.shift()

            try{ this.commandFactory.factory(command).execute(message, args) }
            catch (e: unknown) {
                this.handlerException(message, e)
            }
        }
    }

    onInteraction(interaction: Interaction): void {
        if (!interaction.isCommand()) return

        try { this.commandFactory.factory(interaction.commandName).execute(interaction, null) }
        catch (e: unknown) {
            this.handlerException(interaction, e)
        }
    }

    private handlerException(message: CommandInteraction | Message, exception: unknown): void {
        if (exception instanceof BotError)
            message.reply({embeds:[new ErrorEmbed(exception.message).build()]});
        else message.reply({embeds:[new ErrorEmbed("Something went wrong").build()]})
    }


}

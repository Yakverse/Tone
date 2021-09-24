import { Client, Interaction, Message } from "discord.js";
import { CommandFactory } from "../commands/commandFactory";
import { environment } from "../environments/environment";
import { InvalidCommand } from "../errors/invalidCommand";

export class Event {

    commandFactory: CommandFactory = new CommandFactory()

    constructor(client: Client){
        client.on('messageCreate', (message: Message) => { this.onMessage(message) })
        client.on('interactionCreate', (interaction: Interaction) => { this.onInteraction(interaction) })
    }

    onMessage(message: Message): void {
        if (message.author.bot) return

        if (message.content.startsWith(environment.prefix)){
            let contentSplit: Array<string> = message.content.split(" ")

            let command: string = contentSplit[0].split(environment.prefix)[1]
            if (!command) return

            contentSplit.shift()
            let args: Array<string> = contentSplit

            try{ this.commandFactory.factory(command, message).execute(message, args) }
            catch (e: unknown) {
                if (e instanceof InvalidCommand) message.reply(e.message)
            }
        }
    }

    onInteraction(interaction: Interaction): void {
        if (!interaction.isCommand()) return

        try { this.commandFactory.factory(interaction.commandName, interaction).execute(interaction, null) }
        catch (e) {
            if (e instanceof InvalidCommand) interaction.reply(e.message)
        }
    }


}

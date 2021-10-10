import {Client, CommandInteraction, Guild, Interaction, Message, VoiceState} from "discord.js";
import { CommandFactory } from "../commands/commandFactory";
import { environment } from "../environments/environment";
import BotError from "../errors/botError";
import {ErrorEmbed} from "../embeds/errorEmbed";
import App from "../main";
import { LogTypeEnum } from "../enumerations/logType.enum";
import InvalidCommand from "../errors/invalidCommand";

export class Event {

    commandFactory: CommandFactory = new CommandFactory()

    constructor(client: Client){
        client.on('messageCreate', (message: Message) => { this.onMessage(message) })
        client.on('interactionCreate', (interaction: Interaction) => { this.onInteraction(interaction) })
        client.on('guildCreate', (guild: Guild) => { this.onGuildAdd(guild.name, client.guilds.cache.size) })
        client.on('guildDelete', (guild: Guild) => { this.onGuildRemove(guild.name, client.guilds.cache.size) })
        client.on('voiceStateUpdate', (oldState: VoiceState) => { this.onVoiceStateUpdate(oldState) })
    }

    onMessage(message: Message): void {
        if (message.author.bot) return

        if (message.content.startsWith(environment.prefix)){
            let args: Array<string> = message.content.split(" ")

            let command: string = args[0].split(environment.prefix)[1]
            if (!command) return
            command = command.toLowerCase()

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

    onGuildAdd(guildName: string, numberGuilds: number){ App.logger.send(LogTypeEnum.JOIN_NEW_GUILD, `Joined a new guild: ${guildName} - Total servers: ${numberGuilds}`) }
    onGuildRemove(guildName: string, numberGuilds: number){ App.logger.send(LogTypeEnum.REMOVE_GUILD, `Removed from guild: ${guildName} - Total servers: ${numberGuilds}`) }

    onVoiceStateUpdate(oldState: VoiceState) {
        if (!oldState.channel || !oldState.guild.me) return
        
        if (oldState.channelId !== oldState.guild.me.voice.channelId) return
        
        if (!(oldState.channel.members.size - 1)) this.leaveOnInactiveTimeout(oldState)
    }

    private handlerException(message: CommandInteraction | Message, exception: unknown): void {
        let invalidCommandException = exception as InvalidCommand
        App.logger.send(LogTypeEnum.ERROR, `${invalidCommandException.message}`);
        if (exception instanceof BotError)
            message.reply({embeds:[new ErrorEmbed(exception.message).build()]});
        else message.reply({embeds:[new ErrorEmbed("Something went wrong").build()]})
    }

    private leaveOnInactiveTimeout(oldState: VoiceState){
        setTimeout(() => {
            if (!(oldState.channel!.members.size - 1))
                App.musicController.leave(null, oldState.guild.id)
        }, 5 * 60 * 1000) // 5min
    }
}

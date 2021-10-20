import { ButtonInteraction, Client, CommandInteraction, Guild, Interaction, Message, VoiceState } from "discord.js";
import { CommandFactory } from "../commands/commandFactory";
import { environment } from "../environments/environment";
import BotError from "../errors/botError";
import { ErrorEmbed } from "../embeds/errorEmbed";
import App from "../main";
import { LogTypeEnum } from "../enumerations/logType.enum";
import InvalidCommand from "../errors/invalidCommand";
import { ButtonFactory } from "../commands/buttonFactory";

export class Event {

    commandFactory: CommandFactory = new CommandFactory();
    buttonFactory: ButtonFactory = new ButtonFactory();

    constructor(client: Client){
        client.on('messageCreate', (message: Message) => { this.onMessage(message) })
        client.on('interactionCreate', (interaction: Interaction) => { this.onInteraction(interaction) })
        client.on('guildCreate', (guild: Guild) => { this.onGuildAdd(guild.name, client.guilds.cache.size) })
        client.on('guildDelete', (guild: Guild) => { this.onGuildRemove(guild.name, client.guilds.cache.size) })
        client.on('voiceStateUpdate', (oldState: VoiceState, newState: VoiceState) => { this.onVoiceStateUpdate(oldState, newState) })
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
        try{
            if (interaction.isCommand()){
                this.commandFactory.factory(interaction.commandName).execute(interaction, null)
            } else if (interaction.isButton()) {
                this.buttonFactory.factory(interaction.customId).execute(interaction, null)
            } else {
                return;
            }
        } catch (e) {
            this.handlerException(interaction, e);
        }
    }

    onGuildAdd(guildName: string, numberGuilds: number){ App.logger.send(LogTypeEnum.JOIN_NEW_GUILD, `Joined a new guild: ${guildName} - Total servers: ${numberGuilds}`) }
    onGuildRemove(guildName: string, numberGuilds: number){ App.logger.send(LogTypeEnum.REMOVE_GUILD, `Removed from guild: ${guildName} - Total servers: ${numberGuilds}`) }

    onVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
        // if (newState.guild.me && oldState.id == newState.guild.me.id && !newState.channelId) App.musicController.leave(null, oldState.guild.id)
        if (!oldState.channel || !oldState.guild.me || !newState.guild.me) return

        if (newState.channelId === newState.guild.me.voice.channelId)
            return App.InactivityHandler.deleteAloneTimeout(newState.guild.id)
        
        if (oldState.channelId !== oldState.guild.me.voice.channelId) return
        
        if (!(oldState.channel.members.size - 1)) App.InactivityHandler.createAloneTimeout(oldState.guild.id, oldState)
    }

    private handlerException(message: Message | Interaction , exception: unknown): void {
        let invalidCommandException = exception as InvalidCommand
        App.logger.send(LogTypeEnum.ERROR, `${invalidCommandException.message}`);

        if (exception instanceof BotError){
            if(!(message instanceof Interaction))
                message.reply({ embeds: [new ErrorEmbed(exception.message).build()] });

            else if (message instanceof CommandInteraction)
                message.editReply({ embeds: [new ErrorEmbed(exception.message).build()] });

            else if (message instanceof ButtonInteraction)
                message.reply({ ephemeral: true, embeds:[new ErrorEmbed(exception.message).build()], content:null , components: [] })
        }
        else{
            message.channel!.send({ embeds: [new ErrorEmbed("Something went wrong").build()] });
        }
    }
}

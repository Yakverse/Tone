import { ButtonInteraction, Client, CommandInteraction, Guild, Interaction, Message, VoiceState } from "discord.js";
import { CommandFactory } from "../commands/commandFactory";
import { environment } from "../environments/environment";
import BotError from "../errors/botError";
import { ErrorEmbed } from "../embeds/errorEmbed";
import App from "../main";
import { LogTypeEnum } from "../enumerations/logType.enum";
import { ButtonFactory } from "../commands/buttonFactory";
import {Embeds} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";
import { Command } from "../commands/command";
import SucessEmbed from "../embeds/sucessEmbed";

export class Event {

    commandFactory: CommandFactory = new CommandFactory();
    buttonFactory: ButtonFactory = new ButtonFactory();

    constructor(client: Client){
        client.on('messageCreate', (message: Message) => { this.onMessage(message) })
        client.on('interactionCreate', (interaction: Interaction) => { this.onInteraction(interaction) })
        client.on('guildCreate', (guild: Guild) => { this.onGuildAdd(guild, client.guilds.cache.size) })
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

            this.factoryHandler(message, command, args)
        }
    }

    onInteraction(interaction: Interaction): void {
        try{
            if (interaction.isCommand())
                this.factoryHandler(interaction, interaction.commandName, null)
                
            else if (interaction.isButton()) 
                this.buttonFactory.factory(interaction.customId).execute(interaction, null)

            else 
                return;

        } catch (e) {
            this.handlerException(interaction, e);
        }
    }

    factoryHandler(message: Message | CommandInteraction, command: string, args: Array<string> | null): void {
        try{ 
            let factory = this.commandFactory.factory(command)

            if (!Array.isArray(factory)){
                factory = factory as Command
                if (!(message instanceof Interaction)) factory.execute(message, args)
                else if (message instanceof Interaction) factory.execute(message, null)
                
            } else {
                factory = factory as string[]

                let description: string
                if (factory.length > 1)
                    description =  `The most similar commands are: \n${factory.join('\n')}`
                else 
                    description =  `The most similar command is: \n${factory.join('\n')}`

                let embed = new Embeds({
                    hexColor: ColorsEnum.BLUE,
                    title: "Command not found",
                    description: description,
                })
                message.reply({ embeds: [embed.build()] })
            }
        }
        catch (e: unknown) {
            this.handlerException(message, e)
        }
    }

    onGuildAdd(guild: Guild, numberGuilds: number){
        App.logger.send(LogTypeEnum.JOIN_NEW_GUILD, `Joined a new guild: ${guild.name} - Total servers: ${numberGuilds}`)
        try {
            for (const channel of guild.channels.cache.values()) {
                if (channel.isText())
                    if (channel.permissionsFor(guild.me!).has('SEND_MESSAGES')) {
                        channel.send({ embeds: [new SucessEmbed(`Hello, I'm ${App.bot.client.user?.username}! You can use ${environment.prefix}help to see my commands 😉`).build()] })
                        break
                    }
            }
        } catch (e) {
            App.logger.send(LogTypeEnum.ERROR, `${e}`)
        }
    }
    onGuildRemove(guildName: string, numberGuilds: number){ App.logger.send(LogTypeEnum.REMOVE_GUILD, `Removed from guild: ${guildName} - Total servers: ${numberGuilds}`) }

    onVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
        if (newState.guild.me && oldState.id == newState.guild.me.id && !newState.channelId && App.musicController.getOptionalQueue(oldState.guild.id)) {
            App.musicController.getOptionalQueue(oldState.guild.id)!.message.channel!.send({embeds:[new ErrorEmbed(`I have been kicked from the voice channel 🙁`).build()]})
            App.musicController.leaveAssert(oldState.guild.id)
        }
        if (!oldState.channel || !oldState.guild.me || !newState.guild.me) return

        if (newState.channelId === newState.guild.me.voice.channelId)
            return App.InactivityHandler.deleteAloneTimeout(newState.guild.id)
        
        if (oldState.channelId !== oldState.guild.me.voice.channelId) return
        
        if (!(oldState.channel.members.size - 1)) App.InactivityHandler.createAloneTimeout(oldState.guild.id, oldState)
    }

    private handlerException(message: Message | Interaction , exception: unknown): void {
        if (exception instanceof BotError){
            if(!(message instanceof Interaction))
                message.reply({ embeds: [new ErrorEmbed(exception.message).build()] });

            else if (message instanceof CommandInteraction)
                message.editReply({ embeds: [new ErrorEmbed(exception.message).build()] });

            else if (message instanceof ButtonInteraction)
                message.reply({ ephemeral: true, embeds:[new ErrorEmbed(exception.message).build()], content:null , components: [] })
        }
        else{
            App.logger.send(LogTypeEnum.ERROR, `${exception}`)
            message.channel!.send({ embeds: [new ErrorEmbed("Something went wrong").build()] });
        }
    }
}

import { Client, Events, Interaction } from "discord.js";

export class Event {

    constructor(client: Client){
        client.on(Events.InteractionCreate, (interaction: Interaction) => { this.onInteraction(interaction) })
        // client.on('guildCreate', (guild: Guild) => { this.onGuildAdd(guild, client.guilds.cache.size) })
        // client.on('guildDelete', (guild: Guild) => { this.onGuildRemove(guild.name, client.guilds.cache.size) })
        // client.on('voiceStateUpdate', (oldState: VoiceState, newState: VoiceState) => { this.onVoiceStateUpdate(oldState, newState) })
    }

    async onInteraction(interaction: Interaction): Promise<void> {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }

    // onGuildAdd(guild: Guild, numberGuilds: number){
    //     // App.logger.send(LogTypeEnum.JOIN_NEW_GUILD, `Joined a new guild: ${guild.name} - Total servers: ${numberGuilds}`)
    //     console.log(`Joined a new guild: ${guild.name} - Total servers: ${numberGuilds}`)
    //     try {
    //         for (const channel of guild.channels.cache.values()) {
    //             if (channel.type === ChannelType.GuildText)
    //                 if (channel.permissionsFor(guild.me!)?.has(PermissionsBitField.FLAGS.SEND_MESSAGES)) {
    //                     channel.send({ embeds: [new SucessEmbed(`Hello, I'm ${App.bot.client.user?.username}! You can use ${BOT.PREFIX}help to see my commands 😉`).build()] })
    //                     break
    //                 }
    //         }
    //     } catch (e) {
    //         console.log(`${e}`)
    //     }
    // }
    // onGuildRemove(guildName: string, numberGuilds: number){ App.logger.send(LogTypeEnum.REMOVE_GUILD, `Removed from guild: ${guildName} - Total servers: ${numberGuilds}`) }

    // onVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
    //     if (newState.guild.me && oldState.id == newState.guild.me.id && !newState.channelId && App.musicController.getOptionalQueue(oldState.guild.id)) {
    //         App.musicController.getOptionalQueue(oldState.guild.id)!.message.channel!.send({embeds:[new ErrorEmbed(`I have been kicked from the voice channel 🙁`).build()]})
    //         App.musicController.leaveAssert(oldState.guild.id)
    //     }
    //     if (!oldState.channel || !oldState.guild.me || !newState.guild.me) return

    //     if (newState.channelId === newState.guild.me.voice.channelId)
    //         return App.InactivityHandler.deleteAloneTimeout(newState.guild.id)
        
    //     if (oldState.channelId !== oldState.guild.me.voice.channelId) return
        
    //     if (!(oldState.channel.members.size - 1)) App.InactivityHandler.createAloneTimeout(oldState.guild.id, oldState)
    // }

    // private handlerException(message: Message | Interaction , exception: unknown): void {
    //     if (exception instanceof BotError){
    //         if(!(message instanceof Interaction))
    //             message.reply({ embeds: [new ErrorEmbed(exception.message).build()] });

    //         else if (message instanceof CommandInteraction)
    //             message.editReply({ embeds: [new ErrorEmbed(exception.message).build()] });

    //         else if (message instanceof ButtonInteraction)
    //             message.reply({ ephemeral: true, embeds: [new ErrorEmbed(exception.message).build()], content: null, components: [] })
    //     }
    //     else{
    //         App.logger.send(LogTypeEnum.ERROR, `${exception}`)
    //         message.channel!.send({ embeds: [new ErrorEmbed("Something went wrong").build()] });
    //     }
    // }
}

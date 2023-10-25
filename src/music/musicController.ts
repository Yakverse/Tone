import { joinVoiceChannel} from "@discordjs/voice"
import { CommandInteraction, GuildMember } from "discord.js"
import Utils from "@/utils/utils";
import Guild from "./guildService";

const GUILDS: Map<string, Guild> = new Map<string, Guild>()

export default {
    userIsOnAVoiceChannel(interaction: CommandInteraction) {
        if (!(interaction.member instanceof GuildMember) || !interaction.member!.voice.channel) throw new Error('You are not in a voice channel')
    },

    userIsOnOtherVoiceChannel(interaction: CommandInteraction) {
        const guild = GUILDS.get(interaction.guild!.id)
        if (guild && guild.voiceConnection.joinConfig.channelId !== (interaction.member! as GuildMember).voice.channel!.id) 
            throw new Error("Sorry, I'm in OTHER channel with OTHER friends now")
    },

    botIsOnAVoiceChannel(guildId: string) {
        const guild = GUILDS.get(guildId)
        if (!guild) throw new Error('I am not in a voice channel')
    },

    thereIsSongPlaying(guild: Guild) {
        if (guild.audioPlayer.state.status === "idle") throw new Error("There is no song playing")
    },

    join(interaction: CommandInteraction) {
        this.userIsOnAVoiceChannel(interaction)
        this.userIsOnOtherVoiceChannel(interaction)

        if (GUILDS.has(interaction.guildId!)) return
        
        const guild = new Guild(
            joinVoiceChannel({
                channelId: (interaction.member! as GuildMember).voice.channel!.id,
                guildId: interaction.guild!.id,
                adapterCreator: interaction.guild!.voiceAdapterCreator,
                selfDeaf: true,
            }),
            interaction
        )
        GUILDS.set(interaction.guildId!, guild)

    },

    leave(identifier: CommandInteraction | string) {
        const guildId = identifier instanceof CommandInteraction ? identifier.guild!.id : identifier

        this.botIsOnAVoiceChannel(guildId)
        if (identifier instanceof CommandInteraction) this.userIsOnOtherVoiceChannel(identifier)

        const guild = GUILDS.get(guildId)
        
        guild!.voiceConnection.destroy()
        GUILDS.delete(guildId)
    },

    play(interaction: CommandInteraction) {

        this.join(interaction)
        const guild = GUILDS.get(interaction.guild!.id)!
        guild.addAudioToQueue(interaction.options.get("song")!.value as string)
        
    },

    pause(interaction: CommandInteraction) {

        this.botIsOnAVoiceChannel(interaction.guild!.id)
        this.userIsOnOtherVoiceChannel(interaction)

        const guild = GUILDS.get(interaction.guild!.id)!

        this.thereIsSongPlaying(guild)
        if (guild.audioPlayer.state.status === "paused") throw new Error("Your song is already paused")

        guild.audioPlayer.pause()
    },

    resume(interaction: CommandInteraction) {

        this.botIsOnAVoiceChannel(interaction.guild!.id)
        this.userIsOnOtherVoiceChannel(interaction)

        const guild = GUILDS.get(interaction.guild!.id)!

        this.thereIsSongPlaying(guild)
        if (guild.audioPlayer.state.status === "playing") throw new Error("Your song is already playing")
        
        guild.audioPlayer.unpause()
    },
    
    stop(interaction: CommandInteraction) {
        this.botIsOnAVoiceChannel(interaction.guild!.id)
        this.userIsOnOtherVoiceChannel(interaction)
        
        const guild = GUILDS.get(interaction.guild!.id)!
        
        this.thereIsSongPlaying(guild)

        guild.destroyQueue()
    },

    skip(interaction: CommandInteraction) {
        this.botIsOnAVoiceChannel(interaction.guild!.id)
        this.userIsOnOtherVoiceChannel(interaction)

        const guild = GUILDS.get(interaction.guild!.id)!
        this.thereIsSongPlaying(guild)

        guild.processQueue()
    },

    loop(interaction: CommandInteraction) {
        this.botIsOnAVoiceChannel(interaction.guild!.id)
        this.userIsOnOtherVoiceChannel(interaction)

        const guild = GUILDS.get(interaction.guild!.id)!
        const timesToPlay = interaction.options.get("number") ? interaction.options.get("number")!.value as number : Number.MAX_SAFE_INTEGER
        guild.queue.timesToPlay = timesToPlay
    },

    unloop(interaction: CommandInteraction) {
        this.botIsOnAVoiceChannel(interaction.guild!.id)
        this.userIsOnOtherVoiceChannel(interaction)

        const guild = GUILDS.get(interaction.guild!.id)!
        guild.queue.timesToPlay = 0
    },

    shuffle(interaction: CommandInteraction) {
        this.botIsOnAVoiceChannel(interaction.guild!.id)
        this.userIsOnOtherVoiceChannel(interaction)

        const guild = GUILDS.get(interaction.guild!.id)!

        const firstArraySlice = guild.queue.audios.slice(0, guild.queue.indexActualAudio + 1)
        const secondArraySlice = guild.queue.audios.slice(guild.queue.indexActualAudio + 1)

        guild.queue.audios = [...firstArraySlice, ...Utils.shuffleArray(secondArraySlice)]
    }
}

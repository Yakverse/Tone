import Audio from "./audio";
import {AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, VoiceConnection} from "@discordjs/voice";
import { CommandInteraction, Message } from "discord.js";
import {Embeds} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";
import MusicAlreadyPaused from "../errors/MusicAlreadyPaused";
import MusicAlreadyPlaying from "../errors/MusicAlreadyPlaying";
import App from "../main";
import { LogTypeEnum } from "../enumerations/logType.enum";
import Utils from "../utils/utils";
import {ErrorEmbed} from "../embeds/errorEmbed";

export default class Queue {

    queueTime: number = 0;
    audios: Array<Audio> = new Array<Audio>();
    audioPlayer: AudioPlayer = createAudioPlayer();
    actualAudio: Audio | undefined;
    indexActualAudio: number = 0;
    timesToPlay: number = 1;

    constructor(public voiceConnection: VoiceConnection, public message: Message | CommandInteraction ) {}

    addListener(){
        this.audioPlayer.on('stateChange', async (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) await this.processQueue()
        })

        this.audioPlayer.on('error', async (error) => {
            App.logger.send(LogTypeEnum.ERROR, `Player Error: ${error}`)
            try{
                this.audioPlayer.play(await this.actualAudio!.createAudio())
                this.message.channel?.send({ embeds: [new ErrorEmbed(`There was a problem while playing this song. I'll restart the music to you. Sorry!`).build()] })
            } catch (e) {
                this.skip()
                this.message.channel?.send({ embeds: [new ErrorEmbed(`There was a problem while playing this song. I'll skip to the next. Sorry! 😢`).build()] })
            }
        })

        this.voiceConnection.subscribe(<AudioPlayer> this.audioPlayer)
    }

    addAudio(audio: Audio){
        this.queueTime += Utils.parseISOToSeconds(audio.info.length);

        this.audios.push(audio);
    }

    pause(){
        if( this.audioPlayer.state.status == "paused"){
            throw new MusicAlreadyPaused();
        }
        this.audioPlayer.pause();
    }

    resume(){
        if( this.audioPlayer.state.status == "playing"){
            throw new MusicAlreadyPlaying();
        }
        this.audioPlayer.unpause();
    }

    private clearAudios(){
        this.audios = []
        this.queueTime = 0;
        this.indexActualAudio = 0
        this.timesToPlay = 1
        this.actualAudio = undefined
        this.audioPlayer.stop()
    }

    stop(){
        this.clearAudios()
    }

    loop(number: number | undefined){
        if (number) this.timesToPlay = number - 1
        else this.timesToPlay = Number.MAX_SAFE_INTEGER
    }

    unloop(){
        this.timesToPlay = 0
    }

    skip(){
        this.audioPlayer.stop();
        this.actualAudio = undefined;
    }

    leave(){
        if (this.voiceConnection) this.voiceConnection.destroy()
        this.clearAudios()
    }

    async processQueue(playlist: boolean = false){
        if (this.audioPlayer.state.status !== AudioPlayerStatus.Idle) return

        if (this.audios.length === 0) return

        if (this.audios.length === this.indexActualAudio + 1){
            if (this.timesToPlay > 0){
                this.timesToPlay--
                this.indexActualAudio = 0
            }
            else if (this.timesToPlay === 0) {
                this.clearAudios()
                App.InactivityHandler.createNoMusicTimeout(this.message.guild!.id, this)
                return
            }
        } else if (!playlist) this.indexActualAudio++

        try {
            this.actualAudio = this.audios[this.indexActualAudio]
            const audioResource: AudioResource<Audio> = await this.actualAudio.createAudio()
            App.InactivityHandler.deleteNoMusicTimeout(this.message.guild!.id)
            this.audioPlayer.play(audioResource)

            const title = audioResource.metadata.info.title
            const image = audioResource.metadata.info.thumbnail
            const duration = audioResource.metadata.info.length

            if (this.message.guild) App.logger.send(LogTypeEnum.PLAY_MUSIC, `Playing ${title} in ${this.message.guild.name}`)
            else App.logger.send(LogTypeEnum.PLAY_MUSIC, `Playing ${title} in DM`)

            const embed = new Embeds({
                title: '🎵 Now playing ',
                hexColor: ColorsEnum.GREEN,
                description: `${title} - **${duration}**`
            })
            embed.options.image = image

            if (this.message && this.message instanceof Message) await this.message.edit({ embeds: [embed.build()] })
            else if (this.message) await this.message.editReply({ embeds: [embed.build()] })
        }
        catch (e) {
            const embed = new Embeds({
                title: 'Error loading music',
                hexColor: ColorsEnum.RED,
                description: 'This song is probably age restricted'
            })

            if (this.message && this.message instanceof Message) await this.message.edit({ embeds: [embed.build()] })
            else if (this.message) await this.message.editReply({ embeds: [embed.build()] })

            App.logger.send(LogTypeEnum.ERROR, `${e}`)

            this.processQueue()
        }
    }
}

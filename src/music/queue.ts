import Audio from "./audio";
import {AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, VoiceConnection} from "@discordjs/voice";
import { CommandInteraction, Message } from "discord.js";
import {Embeds} from "../embeds/embed";
import {ColorsEnum} from "../enumerations/Colors.enum";
import NoTracksToSkip from "../errors/noTracksToSkip";
import MusicAlreadyPaused from "../errors/MusicAlreadyPaused";
import MusicAlreadyPlaying from "../errors/MusicAlreadyPlaying";
import App from "../main";
import { LogTypeEnum } from "../enumerations/logType.enum";
import BotIsProcessingError from "../errors/BotIsProcessingError";

export default class Queue {
    // Nome - Duração
    audiosInfo: Array<[string, number]> = new Array<[string, number]>();
    queueTime: number = 0;
    audios: Array<Audio> = new Array<Audio>();
    audioPlayer: AudioPlayer = createAudioPlayer();
    actualAudio: Audio | undefined;
    indexActualAudio: number = 0;
    timesToPlay: number = 1;
    length: number = 0;

    constructor(public voiceConnection: VoiceConnection, public message: Message | CommandInteraction ) {}

    addListener(){
        this.audioPlayer.on('stateChange', async (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) await this.processQueue()
        })

        this.voiceConnection.subscribe(<AudioPlayer> this.audioPlayer)
    }

    addAudio(audio: Audio){
        // let time = parseInt(audio.info.length.simpleText);
        // let title = audio.info.title;
        //
        // this.queueTime += time;
        // this.length +=1;
        // this.audiosInfo.push([title, time]);
        this.audios.push(audio);
    }

    updateMessage(message: Message){
        this.message = message;
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
        this.audiosInfo = [];
        this.queueTime = 0;
        this.indexActualAudio = 0
        this.timesToPlay = 1
        this.audioPlayer.stop()
        this.actualAudio = undefined
        this.length = 0;
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
        if(this.audios.length == 0){
            throw new NoTracksToSkip();
        }

        if(this.audioPlayer.state.status === AudioPlayerStatus.Idle){
            throw new BotIsProcessingError();
        }
        this.audioPlayer.stop();
        this.actualAudio = undefined;
    }

    leave(){
        if (this.voiceConnection) this.voiceConnection.destroy()
        this.clearAudios()
    }

    async processQueue(){
        if (this.audioPlayer.state.status !== AudioPlayerStatus.Idle) return

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
        } else this.indexActualAudio++

        try {
            this.actualAudio = this.audios[this.indexActualAudio]
            const audioResource: AudioResource<Audio> = await this.actualAudio.createAudio()
            App.InactivityHandler.deleteNoMusicTimeout(this.message.guild!.id)
            this.audioPlayer.play(audioResource)

            const title = audioResource.metadata.info.title
            const image = audioResource.metadata.info.thumbnail.thumbnails[0]
            const duration = audioResource.metadata.info.length.simpleText

            if (this.message.guild) App.logger.send(LogTypeEnum.PLAY_MUSIC, `Playing ${title} in ${this.message.guild.name}`)
            else App.logger.send(LogTypeEnum.PLAY_MUSIC, `Playing ${title} in DM`)

            const embed = new Embeds({
                title: '🎵 Now playing ',
                hexColor: ColorsEnum.GREEN,
                description: `${title} **${duration}**`
            })

            if (image) embed.options.image = image.url

            if (this.message && this.message instanceof Message) await this.message.edit({ embeds: [embed.build()] })
            else if (this.message) await this.message.editReply({ embeds: [embed.build()] })
        }
        catch (e) {
            App.logger.send(LogTypeEnum.ERROR, `${e}`)
        }
    }
}

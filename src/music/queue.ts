import Audio from "./audio";
import {AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, VoiceConnection} from "@discordjs/voice";
import { CommandInteraction, Message } from "discord.js";

export default class Queue {

    audios: Array<Audio> = new Array<Audio>()
    audioPlayer: AudioPlayer = createAudioPlayer()
    actualAudio: Audio | undefined
    indexActualAudio: number = 0
    timesToPlay: number = 1

    constructor(public voiceConnection: VoiceConnection, public message: Message | CommandInteraction ) {}

    addListener(){
        this.audioPlayer.on('stateChange', async (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) await this.processQueue()
        })

        this.voiceConnection.subscribe(<AudioPlayer> this.audioPlayer)
    }

    addAudio(audio: Audio){
        this.audios.push(audio)
    }

    private clearAudios(){
        this.audios = []
        this.indexActualAudio = 0
        this.timesToPlay = 1
        this.audioPlayer.stop()
        this.actualAudio = undefined
    }

    stop(){
        this.clearAudios()
    }

    loop(){
        this.timesToPlay = Number.MAX_SAFE_INTEGER
    }

    unloop(){
        this.timesToPlay = 0
    }

    skip(){
        this.audioPlayer.stop()
        this.actualAudio = undefined
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
                return
            }
        } else this.indexActualAudio++

        try {
            this.actualAudio = this.audios[this.indexActualAudio]
            const audioResource: AudioResource<Audio> = await this.actualAudio.createAudio()
            this.audioPlayer.play(audioResource)
            if (this.message && this.message instanceof Message) await this.message.edit(`Now playing ${audioResource.metadata.info.videoDetails.title}`)
            else if (this.message) await this.message.editReply(`Now playing ${audioResource.metadata.info.videoDetails.title}`)
        }
        catch (e) { console.log(e) }
    }
}
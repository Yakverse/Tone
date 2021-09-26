import Audio from "./audio";
import {AudioPlayer, createAudioPlayer, VoiceConnection} from "@discordjs/voice";
import { CommandInteraction, Message } from "discord.js";

export default class Track{
    audios: Array<Audio> = new Array<Audio>()
    audioPlayer: AudioPlayer = createAudioPlayer()
    actualAudio: Audio | undefined

    constructor(public voiceConnection: VoiceConnection, public message: Message | CommandInteraction ) {}

    clearAudios(){
        this.audios = []
        this.stop()
    }

    stop(){
        this.audioPlayer.stop()
        this.actualAudio = undefined
    }
}

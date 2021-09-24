import Audio from "./audio";
import {AudioPlayer, createAudioPlayer, VoiceConnection} from "@discordjs/voice";
import {Mode} from "./trackEnum";

export default class Track{
    audios: Array<Audio> = new Array<Audio>()
    audioPlayer: AudioPlayer = createAudioPlayer()
    mode: Mode = Mode.NORMAL
    actualAudio: Audio | undefined

    constructor(public voiceConnection: VoiceConnection ) {}

    clearAudios(){
        this.audios = []
        this.stop()
    }

    stop(){
        this.audioPlayer.stop()
        this.actualAudio = undefined
        this.mode = Mode.NORMAL
    }
}

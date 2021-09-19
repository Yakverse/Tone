import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, VoiceConnection } from "@discordjs/voice";
import Track from "./track";
import { getInfo } from 'ytdl-core';
// import { promisify } from 'util';

// const wait = promisify(setTimeout);

export default class CommandMusic {

    private voiceConnection: VoiceConnection | undefined
    audioPlayer: AudioPlayer
    queue: Array<Track> = []

    constructor(){
        this.audioPlayer = createAudioPlayer()
    }

    get getVoiceConnection(){ return this.voiceConnection }
    set setVoiceConnection(voiceConnection: VoiceConnection){
        this.voiceConnection = voiceConnection
        
        this.audioPlayer.on('stateChange', (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) 
                this.processQueue()
        })

        this.voiceConnection!.subscribe(this.audioPlayer)
    }

    stop(){
        this.queue = []
        if (this.voiceConnection) this.voiceConnection.destroy()
        this.voiceConnection = undefined
        this.audioPlayer.stop()
    }    

    async addQueue(url: string): Promise<string>{
        let info = await getInfo(url)
        this.queue.push(new Track(url, info.videoDetails.title))
        this.processQueue()
        return info.videoDetails.title
    }

    async processQueue(){
        if (this.audioPlayer.state.status !== AudioPlayerStatus.Idle || this.queue.length === 0) return

        const nextTrack = this.queue.shift()!
        try { this.audioPlayer.play(await nextTrack.createAudio()) }
        catch (e) { return this.processQueue } //try next track
    }

}
import {AudioPlayer, AudioPlayerStatus, VoiceConnection} from "@discordjs/voice";
import {getInfo, MoreVideoDetails} from 'ytdl-core';
import Audio from "./audio";
import Track from "./track";
// import { promisify } from 'util';

// const wait = promisify(setTimeout);

export default class CommandMusic {

    queue: Map<string, Track> = new Map<string, Track>();

    setVoiceConnection(voiceConnection: VoiceConnection, guildId: string){

        let track: Track | undefined = this.queue.get(guildId)
        if (!track) track = this.queue.set(guildId, new Track(voiceConnection)).get(guildId)
        if (track!.audioPlayer) {
            track!.audioPlayer.on('stateChange', (oldState, newState) => {
                if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) this.processQueue(guildId)
            })
        }
        track!.voiceConnection = voiceConnection
        track!.voiceConnection.subscribe(<AudioPlayer> track!.audioPlayer)

    }

    stop(guildId: string){
        const track: Track | undefined = this.queue.get(guildId)
        if (!track) return
        let voiceConnection: VoiceConnection | undefined = track.voiceConnection
        if (voiceConnection) voiceConnection.destroy()
        voiceConnection = undefined
        track.audioPlayer.stop()
    }    

    async addQueue(guildId: string, url: string): Promise<MoreVideoDetails>{
        let info = await getInfo(url)
        let track: Track | undefined = this.queue.get(guildId)
        // TODO: RETURN
        if (!track) return info.videoDetails
        track.audios.push(new Audio(url, info.videoDetails.title))
        await this.processQueue(guildId)
        return info.videoDetails
    }

    async processQueue(guildId: string){
        const track: Track | undefined = this.queue.get(guildId)
        if (track) {
            if (track.audioPlayer.state.status !== AudioPlayerStatus.Idle || track.audios.length === 0) return
            const nextTrack = track.audios.shift()!
            try {
                track.audioPlayer.play(await nextTrack.createAudio())
            }
            catch (e) { console.log(e) }
        }

    }

}

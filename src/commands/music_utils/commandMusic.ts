import { AudioPlayer, AudioPlayerStatus, AudioResource, VoiceConnection } from "@discordjs/voice";
import { videoInfo } from 'ytdl-core';
import Audio from "./audio";
import Track from "./track";
import { CommandInteraction, Message } from "discord.js";

export default class CommandMusic {

    queue: Map<string, Track> = new Map<string, Track>();
    message: Message | CommandInteraction | undefined

    setVoiceConnection(voiceConnection: VoiceConnection, guildId: string){

        let track: Track | undefined = this.queue.get(guildId)
        if (!track) track = this.queue.set(guildId, new Track(voiceConnection)).get(guildId)
        track!.audioPlayer.on('stateChange', (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) this.processQueue(guildId)
        })
        track!.voiceConnection = voiceConnection
        track!.voiceConnection.subscribe(<AudioPlayer> track!.audioPlayer)

    }

    leave(guildId: string){
        const track: Track | undefined = this.queue.get(guildId)
        if (!track) return
        let voiceConnection: VoiceConnection | undefined = track.voiceConnection
        if (voiceConnection) voiceConnection.destroy()
        track.clearAudios()
        this.queue.delete(guildId)
    }

    stop(guildId: string){
        const track: Track | undefined = this.queue.get(guildId)
        if (!track) return
        track.clearAudios()
    }

    skip(guildId: string){
        const track: Track | undefined = this.queue.get(guildId)
        if (!track) return
        track.stop()
    }

    async addQueue(guildId: string, videoInfo: videoInfo): Promise<videoInfo | undefined>{
        let track: Track | undefined = this.queue.get(guildId)
        // TODO: RETURN
        if (!track) return
        track.audios.push(new Audio(videoInfo))
        await this.processQueue(guildId)
    }

    loop(guildId: string){
        const track: Track | undefined = this.queue.get(guildId)
        if (!track) return
        if (!track.actualAudio) return
        track.actualAudio.timesToPlay = Number.MAX_SAFE_INTEGER
    }

    unloop(guildId: string){
        const track: Track | undefined = this.queue.get(guildId)
        if (!track) return
        track.audios[0].timesToPlay = 0
    }

    async processQueue(guildId: string){
        const track: Track | undefined = this.queue.get(guildId)
        if (track) {
            if (track.audioPlayer.state.status !== AudioPlayerStatus.Idle) return
            if (track.audios.length === 0){
                if (track.actualAudio){
                    if (track.actualAudio.timesToPlay <= 0){
                        return
                    }
                } else return
            } else {
                if (track.actualAudio){
                    if (track.actualAudio!.timesToPlay <= 0) {
                        track.actualAudio = track.audios.shift()!
                    }
                } else track.actualAudio = track.audios.shift()!
            }

            try {
                const audioResource: AudioResource<Audio> = await track.actualAudio.createAudio()
                track.actualAudio.timesToPlay -= 1
                track.audioPlayer.play(audioResource)
                if (this.message) await this.message.reply(`Now playing ${audioResource.metadata.info.videoDetails.title}`)
            }
            catch (e) { console.log(e) }
        }

    }

}

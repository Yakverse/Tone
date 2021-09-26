import {AudioPlayer, AudioPlayerStatus, AudioResource, VoiceConnection} from "@discordjs/voice";
import {videoInfo} from 'ytdl-core';
import Audio from "./audio";
import Track from "./track";
import {Mode} from "./trackEnum";
import {CommandInteraction, Message} from "discord.js";

export default class CommandMusic {

    queue: Map<string, Track> = new Map<string, Track>();

    setVoiceConnection(voiceConnection: VoiceConnection, guildId: string, message: Message | CommandInteraction){

        let track: Track | undefined = this.queue.get(guildId)

        if (!track)
            track = this.queue.set(guildId, new Track(voiceConnection, message)).get(guildId)

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
        if (voiceConnection) 
            voiceConnection.destroy()

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

        track.mode = Mode.LOOP
    }

    unloop(guildId: string){
        const track: Track | undefined = this.queue.get(guildId)
        if (!track) return

        track.mode = Mode.NORMAL
    }

    setMessage(guildId: string, message: Message | CommandInteraction) {
        const track: Track | undefined = this.queue.get(guildId)
        if (track) 
            track.message = message
    }

    async processQueue(guildId: string){
        const track: Track | undefined = this.queue.get(guildId)
        if (track) {
            if (track.audioPlayer.state.status !== AudioPlayerStatus.Idle || (track.audios.length === 0 && track.mode == Mode.NORMAL)) return
            if (track.mode == Mode.NORMAL || !track.actualAudio) track.actualAudio = track.audios.shift()!
            
            try {
                const audioResource: AudioResource<Audio> = await track.actualAudio.createAudio()
                track.audioPlayer.play(audioResource)
                if (track.message && track.message instanceof Message) await track.message.edit(`Now playing ${audioResource.metadata.info.videoDetails.title}`)
                else if (track.message) await track.message.editReply(`Now playing ${audioResource.metadata.info.videoDetails.title}`)
            }
            catch (e) { console.log(e) }
        }

    }

}

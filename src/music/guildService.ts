import { AudioPlayer, AudioPlayerState, AudioPlayerStatus, createAudioPlayer, createAudioResource, NoSubscriberBehavior, VoiceConnection, VoiceConnectionState } from "@discordjs/voice";
import { CommandInteraction } from "discord.js";
import ytdl from "ytdl-core";

class Queue {

    queueTime: number = 0;
    audios: Array<string> = [];
    indexActualAudio: number = -1;
    timesToPlay: number = 0;

}

export default class Guild {
    voiceConnection: VoiceConnection;
    interaction: CommandInteraction;
    queue: Queue = new Queue();
    audioPlayer: AudioPlayer = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Stop,
            maxMissedFrames: Math.round(5000 / 20), //documentation recommendation
        },
    })
    actualAudio: internal.Readable | undefined

    constructor(voiceConnection: VoiceConnection, interaction: CommandInteraction) {
        this.voiceConnection = voiceConnection
        this.interaction = interaction

        this.voiceConnection.on("stateChange", (oldState: VoiceConnectionState, newState: VoiceConnectionState) => {
            Reflect.get(oldState, 'networking')?.off('stateChange', this.networkStateChangeHandler);
            Reflect.get(newState, 'networking')?.on('stateChange', this.networkStateChangeHandler);

            if (newState.status === "disconnected" || newState.status === "destroyed") {
                this.destroyQueue()
            }
        })

        this.audioPlayer.on("stateChange", (oldState: AudioPlayerState, newState: AudioPlayerState) => {
            if (newState.status === AudioPlayerStatus.Idle && oldState.status === AudioPlayerStatus.Playing) {
                this.processQueue()
            }
        })

        this.voiceConnection.on("error", (error: Error) => {
            console.log("v",error)
        })

        // this.audioPlayer.on("error", (error: Error) => {
        //     if (error.message === "Status code: 410") {
        //         throw new Error("The song you are trying to play is age restricted")
        //     }
        // })
    }

    private networkStateChangeHandler = (_: VoiceConnectionState, newNetworkState: VoiceConnectionState) => {
        const newUdp = Reflect.get(newNetworkState, 'udp');
        clearInterval(newUdp?.keepAliveInterval);
    }

    addAudioToQueue(audio: string) {
        this.queue.audios.push(audio)
        if (this.audioPlayer.state.status === AudioPlayerStatus.Idle) {
            this.processQueue()
        }
    }

    destroyQueue() {
        this.actualAudio.destroy()
        this.audioPlayer.stop()
        this.queue = new Queue()
    }

    processQueue() {

        if (this.queue.indexActualAudio === this.queue.audios.length -1) {
            if (!this.queue.timesToPlay) {
                this.destroyQueue()
                return
            } else {
                this.queue.indexActualAudio = -1
                this.queue.timesToPlay--
            }
        }
        
        this.queue.indexActualAudio++
        try {
            this.actualAudio = ytdl(
                this.queue.audios[this.queue.indexActualAudio],
                { filter: 'audioonly', quality: 'highestaudio', dlChunkSize: 0, highWaterMark: 1 << 25 }
            )
        } catch (error) {
            console.log(error)
        }

        this.audioPlayer.play(createAudioResource(this.actualAudio))
        this.voiceConnection.subscribe(this.audioPlayer)
    }

    errorHandler(error: Error) {

    }
}

import { AudioResource, createAudioResource, demuxProbe } from "@discordjs/voice";
import { raw as ytdl } from 'youtube-dl-exec';

export default class Track {

    url: string
    title: string

    constructor(url: string, title: string) {
        this.url = url,
        this.title = title
    }

    createAudio(): Promise<AudioResource<Track>>{
        return new Promise((resolve, reject) => {
            const process = ytdl(
                this.url,
                {
					o: '-',
					q: '',
					f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
					r: '100K',
				},
				{ stdio: ['ignore', 'pipe', 'ignore'] }
            )

            if (!process.stdout) {
                reject(new Error('Stream Error'))
                return
            }
            let stream = process.stdout

            process.once('spawn', () => {
                demuxProbe(stream).then(probe => {
                    resolve(createAudioResource(stream, { metadata: this, inputType: probe.type }))
                }).catch(e => {
                    if (!process.kill) process.kill
                    stream.resume()
                    reject(e)
                })
            })
        })
    }

}
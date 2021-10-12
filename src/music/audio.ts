import { AudioResource, createAudioResource, demuxProbe } from "@discordjs/voice";
import { raw as ytdl } from 'youtube-dl-exec';
import { LogTypeEnum } from "../enumerations/logType.enum";
import App from "../main";
import {SearchInfoDTO} from "../dto/SearchInfoDTO";

export default class Audio {

    constructor(public info: SearchInfoDTO) {}

    createAudio(): Promise<AudioResource<Audio>>{
        return new Promise((resolve, reject) => {
            let url: string = `https://www.youtube.com/watch?v=${this.info.id}`
            const process = ytdl(
                url,
                {
                    o: '-',
                    q: '',
                    f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
                    r: '100K',
                },
                { stdio: ['ignore', 'pipe', 'ignore'] }
            )

            if (!process.stdout) {
                App.logger.send(LogTypeEnum.ERROR, `Stream error with URL: ${url}`)
                reject(new Error('Stream Error'))
                return
            }
            let stream = process.stdout

            process.once('spawn', () => {
                demuxProbe(stream).then(probe => {
                    resolve(createAudioResource(stream, { metadata: this, inputType: probe.type }))
                }).catch(e => {
                    App.logger.send(LogTypeEnum.ERROR, `${e}`);
                    if (!process.kill) process.kill
                    stream.resume()
                    reject(e)
                })
            })
        })
    }

}

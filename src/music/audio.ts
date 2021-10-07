import { AudioResource, createAudioResource, demuxProbe } from "@discordjs/voice";
import { raw as ytdl } from 'youtube-dl-exec';
import {videoInfo} from "ytdl-core";
import { LogTypeEnum } from "../enumerations/logType.enum";
import App from "../main";

export default class Audio {

    constructor(public info: videoInfo) {}

    createAudio(): Promise<AudioResource<Audio>>{
        return new Promise((resolve, reject) => {
            let url = this.info.videoDetails.video_url
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

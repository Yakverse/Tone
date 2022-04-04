import {AudioResource, createAudioResource, demuxProbe, ProbeInfo} from "@discordjs/voice";
import ytdl from 'ytdl-core';
import { VideoInfo } from "../dto/SearchInfoDTO";
import { LogTypeEnum } from "../enumerations/logType.enum";
import App from "../main";
import { MISC, PLAYER } from "../utils/constants";
const scdl = require('soundcloud-downloader').default;
import { Readable } from 'stream';

export default class Audio {

    private retries: number = MISC.RETRIES

    constructor(public info: VideoInfo) {}

    async createAudio(): Promise<AudioResource<Audio>>{
        return new Promise(async (resolve, reject) => {
            try{
                let stream: ProbeInfo | void

                while (this.retries) {
                    stream = await this.createStream().catch(_ => {})
                    if (stream) break

                    this.retries--
                }

                this.retries = MISC.RETRIES

                if (stream) {
                    resolve(createAudioResource(stream.stream, { metadata: this, inputType: stream.type }))
                } else {
                    MISC.YTB_BLOCK = true
                    App.logger.send(LogTypeEnum.ERROR, 'Youtube block set to true')
                    setTimeout(() => {
                        MISC.YTB_BLOCK = false
                    }, 60 * 60 * 1000) // 1h

                    reject()
                }

            } catch(e) {
                App.logger.send(LogTypeEnum.ERROR, `Stream Error: ${e}`)
                reject('Error loading music, this song is probably age restricted')
            }
        })

    }

    private async createStream(): Promise<ProbeInfo | void> {
        let originalStream: Readable

        if (this.info.type === 'soundcloud'){
            originalStream = await scdl.downloadFormat(this.info.url, scdl.FORMATS.OPUS)
            
        } else {
            originalStream = ytdl(this.info.url, {
                quality: 'highestaudio',
                filter: 'audioonly',
                dlChunkSize: 0,
                highWaterMark: 1 << 25,
                requestOptions: {
                    headers: {
                        cookie: PLAYER.COOKIE
                    }
                },
                // IPv6Block: '2001:2::/48' // Force Stream Errors for debugging
            })
        }

        return await demuxProbe(originalStream)
    }

}

import {AudioResource, createAudioResource, demuxProbe, ProbeInfo} from "@discordjs/voice";
import ytdl from 'ytdl-core';
import { VideoInfo } from "../dto/SearchInfoDTO";
import { LogTypeEnum } from "../enumerations/logType.enum";
import App from "../main";
import { PLAYER } from "../utils/constants";
const scdl = require('soundcloud-downloader').default;

export default class Audio {

    constructor(public info: VideoInfo) {}

    async createAudio(): Promise<AudioResource<Audio>>{
        return new Promise(async (resolve, reject) => {
            try{
                let originalStream

                if (this.info.type === 'soundcloud'){
                    originalStream = await scdl.downloadFormat(this.info.url, scdl.FORMATS.OPUS)

                }
                else {
                    let url: string = this.info.url
                    originalStream = ytdl(url, {
                        quality: 'highestaudio',
                        filter: 'audioonly',
                        dlChunkSize: 0,
                        highWaterMark: 1 << 25,
                        requestOptions: {
                            headers: {
                                cookie: PLAYER.COOKIE
                            }
                        }
                    })
                }

                const stream: ProbeInfo | void = await demuxProbe(originalStream).catch((e) => {
                    App.logger.send(LogTypeEnum.ERROR, `Stream Error: ${e}`)
                })

                if (stream){
                    resolve(createAudioResource(stream.stream, { metadata: this, inputType: stream.type }))
                } else {
                    setTimeout(() => {
                        resolve(this.createAudio())
                    }, 1000)
                }



            } catch(e) {
                console.log(e)
                App.logger.send(LogTypeEnum.ERROR, `Stream Error: ${e}`)
                reject('Error loading music, this song is probably age restricted')
            }
        })
    }

}

import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";
import ytdl from 'ytdl-core-discord';
import {SearchInfoDTO} from "../dto/SearchInfoDTO";
import { LogTypeEnum } from "../enumerations/logType.enum";
import { environment } from "../environments/environment";
import App from "../main";
const scdl = require('soundcloud-downloader').default;

export default class Audio {

    constructor(public info: SearchInfoDTO) {}

    async createAudio(): Promise<AudioResource<Audio>>{
        return new Promise(async (resolve, reject) => {
            try{
                let stream
                let streamType

                if (this.info.type === 'soundcloud'){
                    streamType = StreamType.OggOpus;
                    stream = await scdl.downloadFormat(this.info.url, scdl.FORMATS.OPUS)

                } else {
                    let url: string = this.info.url
                    streamType = StreamType.Opus;
                    stream = await ytdl(url, {
                        quality: 'highestaudio',
                        filter: 'audioonly',
                        dlChunkSize: 0,
                        highWaterMark: 1 << 25,
                        requestOptions: {
                            headers: {
                                cookie: environment.cookie
                            }
                        }
                    })
                }

                resolve(createAudioResource(stream, { metadata: this, inputType: streamType }))

            } catch(e) {
                App.logger.send(LogTypeEnum.ERROR, `Stream Error: ${e}`)
                reject('Error loading music, this song is probably age restricted')
            }
        })
    }

}

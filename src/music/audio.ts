import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";
import ytdl from 'ytdl-core-discord';
import {SearchInfoDTO} from "../dto/SearchInfoDTO";
import { LogTypeEnum } from "../enumerations/logType.enum";
import App from "../main";

export default class Audio {

    constructor(public info: SearchInfoDTO) {}

    async createAudio(): Promise<AudioResource<Audio>>{
        return new Promise(async (resolve, reject) => {
            let url: string = `https://www.youtube.com/watch?v=${this.info.id}&c=TVHTML5&cver=7.20190319`
    
            try{
                const stream = await ytdl(url, {
                    quality: 'highestaudio',
                    filter: 'audioonly',
                    dlChunkSize: 0,
                    highWaterMark: 1 << 25
                })

                resolve(createAudioResource(stream, { metadata: this, inputType: StreamType.Opus }))
            } catch(e) {
                App.logger.send(LogTypeEnum.ERROR, `Stream Error: ${e}`)
                reject('Error loading music, this song is probably age restricted')
            }
        })
    }

}

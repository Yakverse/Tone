// export default class Audio {

import ytdl from "ytdl-core";

//     private retries: number = MISC.RETRIES

//     constructor(public info: VideoInfo) {}

//     async createAudio(): Promise<AudioResource<Audio>>{
//         return new Promise(async (resolve, reject) => {
//             try{
//                 let stream: ProbeInfo | void

//                 while (this.retries) {
//                     stream = await this.createStream().catch(error => {App.logger.send(LogTypeEnum.ERROR, `${error}`)})
//                     if (stream) break

//                     this.retries--
//                 }

//                 this.retries = MISC.RETRIES

//                 if (stream) {
//                     resolve(createAudioResource(stream.stream, { metadata: this, inputType: stream.type }))
//                 } else {
//                     MISC.YTB_BLOCK = true
//                     App.logger.send(LogTypeEnum.ERROR, 'Youtube block set to true')
//                     setTimeout(() => {
//                         MISC.YTB_BLOCK = false
//                         App.logger.send(LogTypeEnum.ERROR, 'Youtube block set to false')
//                     }, 60 * 60 * 1000) // 1h

//                     reject()
//                 }

//             } catch(e) {
//                 App.logger.send(LogTypeEnum.ERROR, `Stream Error: ${e}`)
//                 reject('Error loading music, this song is probably age restricted')
//             }
//         })

//     }

//     private async createStream(): Promise<ProbeInfo | void> {
//         let originalStream: Readable

//         if (this.info.type === 'soundcloud'){
//             originalStream = await scdl.downloadFormat(this.info.url, scdl.FORMATS.OPUS)
            
//         } else {
//             originalStream = ytdl(this.info.url, {
//                 quality: 'highestaudio',
//                 filter: 'audioonly',
//                 dlChunkSize: 0,
//                 requestOptions: {
//                     headers: {
//                         cookie: PLAYER.COOKIE
//                     }
//                 },
//                 // IPv6Block: '2001:2::/48' // Force Stream Errors for debugging
//             })
//         }

//         return await demuxProbe(originalStream)
//     }

// }

export default class Audio {
    createStream(url: string) {
        return ytdl(url, { filter: 'audioonly', quality: 'highestaudio', dlChunkSize: 0 })
    }
}

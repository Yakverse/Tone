import {SearchInfoDTO} from "../dto/SearchInfoDTO";
import NoMusicFound from "../errors/NoMusicFound";
import ytdl from 'ytdl-core';
import Utils from "../utils/utils";
const youtubesearchapi = require('youtube-search-api');
const scdl = require('soundcloud-downloader').default;

export default class MusicSearch{

    static async search(query: string): Promise<SearchInfoDTO>{
        const soundCloudRegex = /(snd\.sc|soundcloud\.com)/

        switch (true) {
            case (soundCloudRegex.test(query)):
                return this.soundcloudSearch(query);
            default:
                return this.youtubeSearch(query);
        }
    }

    private static async soundcloudSearch(query: string): Promise<SearchInfoDTO> {
        const info = await scdl.getInfo(query)
        if (info.response)
            throw new NoMusicFound()

        let time = new Date(info.duration).toISOString().slice(11, -5)
        if (time.slice(0, 2) == '00') time = time.slice(3)
        
        return {
            id: info.id as string,
            type: 'soundcloud',
            url: query,
            thumbnail: info.artwork_url as string,
            title: info.title as string,
            length: time
        }
    }

    private static async youtubeSearch(query: string): Promise<SearchInfoDTO>{
        if (ytdl.validateURL(query)){
            const res = await ytdl.getBasicInfo(query)
            return {
                id: res.videoDetails.videoId,
                type: 'video',
                url: res.videoDetails.video_url,
                thumbnail: res.videoDetails.thumbnails[res.videoDetails.thumbnails.length - 1].url,
                title: res.videoDetails.title,
                length: Utils.parseSecondsToISO(parseInt(res.videoDetails.lengthSeconds))
            }
        }
        else {
            const searchDTO = await youtubesearchapi.GetListByKeyword(query, false)
            if (searchDTO.items.length === 0) throw new NoMusicFound()
            for (let i = 0; i < searchDTO.items.length; i++){
                if (searchDTO.items[i].type === 'video'){
                    let item = searchDTO.items[i]
                    return {
                        id: item.id,
                        type: item.type,
                        url: `https://www.youtube.com/watch?v=${item.id}`,
                        thumbnail: item.thumbnail.thumbnails[0].url,
                        title: item.title,
                        length: item.length.simpleText
                    }
                }
            }
            throw new NoMusicFound()
        }


    }
}

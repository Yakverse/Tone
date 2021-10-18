import { SearchInfoDTO, VideoInfo } from "../dto/SearchInfoDTO";
import NoMusicFound from "../errors/NoMusicFound";
import ytdl from 'ytdl-core';
import Utils from "../utils/utils";
import { VideoTypes } from "../enumerations/videoType.enum";
import PlaylistLimit from "../errors/PlaylistLimit";
const youtubesearchapi = require('youtube-search-api');
const scdl = require('soundcloud-downloader').default;
const ytfps = require('@maroxy/ytfps');

export default class MusicSearch {

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
            type: VideoTypes.SOUNDCLOUD,
            url: query,
            thumbnail: info.artwork_url as string,
            title: info.title as string,
            length: time,
            videos: undefined
        }
    }

    private static async youtubeSearch(query: string): Promise<SearchInfoDTO>{
        if (ytdl.validateURL(query)){
            const res = await ytdl.getBasicInfo(query)
            return {
                id: res.videoDetails.videoId,
                type: VideoTypes.YOUTUBE_VIDEO,
                url: res.videoDetails.video_url,
                thumbnail: res.videoDetails.thumbnails[res.videoDetails.thumbnails.length - 1].url,
                title: res.videoDetails.title,
                length: Utils.parseSecondsToISO(parseInt(res.videoDetails.lengthSeconds)),
                videos: undefined
            }
        }
        else {
            let searchDTO = await youtubesearchapi.GetListByKeyword(query, true)
            if (searchDTO.items.length == 0) 
                throw new NoMusicFound()

            let item = searchDTO.items[0]
            if (item.type === VideoTypes.YOUTUBE_VIDEO) {
                return {
                    id: item.id,
                    type: VideoTypes.YOUTUBE_VIDEO,
                    url: `https://www.youtube.com/watch?v=${item.id}`,
                    thumbnail: item.thumbnail.thumbnails[item.thumbnail.thumbnails.length - 1].url,
                    title: item.title,
                    length: item.length.simpleText,
                    videos: undefined
                }
            } else if (item.type === VideoTypes.YOUTUBE_PLAYLIST) {

                if (searchDTO.items[0].videoCount > 1000) 
                    throw new PlaylistLimit()

                let playlist = await ytfps(searchDTO.items[0].id)
                let videos: VideoInfo[] = []
                
                for (let item of playlist.videos){
                    videos.push({
                        id: item.id,
                        type: VideoTypes.YOUTUBE_VIDEO,
                        url: `https://www.youtube.com/watch?v=${item.id}`,
                        thumbnail: item.thumbnail_url,
                        title: item.title,
                        length: item.length
                    })
                }

                return {
                    id: playlist.id,
                    type: VideoTypes.YOUTUBE_PLAYLIST,
                    url: playlist.url,
                    thumbnail: playlist.thumbnail_url,
                    title: playlist.title,
                    length: playlist.videos.length,
                    videos: videos
                }
            }
        }
        throw new NoMusicFound()
    }
}

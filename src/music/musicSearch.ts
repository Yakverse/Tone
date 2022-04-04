import { SearchInfoDTO, VideoInfo } from "../dto/SearchInfoDTO";
import ytdl from 'ytdl-core';
import Utils from "../utils/utils";
import { VideoTypes } from "../enumerations/videoType.enum";
import { MISC, PLAYER } from "../utils/constants";
const youtubesearchapi = require('youtube-search-api');
const scdl = require('soundcloud-downloader').default;
const ytfps = require('@maroxy/ytfps');
const spdl = require('spdl-core');

export default class MusicSearch {

    static async search(query: string): Promise<SearchInfoDTO>{
        const soundCloudRegex = /(snd\.sc|soundcloud\.com)/

        switch (true) {
            case (soundCloudRegex.test(query)):
                return this.soundcloudSearch(query);
            case (spdl.validateURL(query, 'track')):
                return this.spotifySearch(query);
            case (spdl.validateURL(query, 'playlist') || spdl.validateURL(query, 'album')):
                throw new Error('PLAYLIST_ALBUM_NOT_SUPPORTED');
            default:
                return this.youtubeSearch(query);
        }
    }

    private static async soundcloudSearch(query: string): Promise<SearchInfoDTO> {
        const info = await scdl.getInfo(query)
        if (info.response)
            throw new Error("MUSIC_NOT_FOUND")

        let time = new Date(info.duration).toISOString().slice(11, -5)
        if (time.slice(0, 2) == '00') time = time.slice(3)
        
        return {
            id: info.id as string,
            type: VideoTypes.SOUNDCLOUD,
            url: query,
            thumbnail: info.artwork_url as string,
            title: info.title as string,
            length: time
        }
    }

    private static async spotifySearch(query: string): Promise<SearchInfoDTO>{
        const info = await spdl.getInfo(query)
        const title = `${info.title} - ${info.artist}`
        const youtubeInfo = await this.youtubeSearch(`${title} ${info.artist}`)

        return {
            id: youtubeInfo.id,
            type: VideoTypes.SPOTIFY,
            url: youtubeInfo.url,
            thumbnail: info.thumbnail,
            title: title,
            length: youtubeInfo.length
        }
    }

    private static async youtubeSearch(query: string): Promise<SearchInfoDTO>{
        if (MISC.YTB_BLOCK) 
            throw new Error("YOUTUBE_BLOCK")

        if (ytdl.validateURL(query)){
            const res = await ytdl.getBasicInfo(query, {
                requestOptions: {
                    headers: {
                        cookie: PLAYER.COOKIE
                    }
                }
            })
            return {
                id: res.videoDetails.videoId,
                type: VideoTypes.YOUTUBE_VIDEO,
                url: res.videoDetails.video_url,
                thumbnail: res.videoDetails.thumbnails[res.videoDetails.thumbnails.length - 1].url,
                title: res.videoDetails.title,
                length: Utils.parseSecondsToISO(parseInt(res.videoDetails.lengthSeconds))
            }
        }
        else {
            let searchDTO = await youtubesearchapi.GetListByKeyword(query, true)
            searchDTO.items = searchDTO.items.filter((item: any) => item.type === 'video' || item.type === 'playlist')

            if (searchDTO.items.length == 0) 
                throw new Error("MUSIC_NOT_FOUND")

            let item = searchDTO.items[0]
            if (item.type === VideoTypes.YOUTUBE_VIDEO) {
                return {
                    id: item.id,
                    type: VideoTypes.YOUTUBE_VIDEO,
                    url: `https://www.youtube.com/watch?v=${item.id}`,
                    thumbnail: item.thumbnail.thumbnails[item.thumbnail.thumbnails.length - 1].url,
                    title: item.title,
                    length: item.length.simpleText
                }
            } else if (item.type === VideoTypes.YOUTUBE_PLAYLIST) {

                if (searchDTO.items[0].videoCount > PLAYER.PLAYLIST_LIMIT) 
                    throw new Error("PLAYLIST_LIMIT")

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
        throw new Error("MUSIC_NOT_FOUND")
    }
}

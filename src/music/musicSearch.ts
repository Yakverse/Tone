import {SearchInfoDTO} from "../dto/SearchInfoDTO";
import {SearchDTO} from "../dto/SearchDTO";
import NoMusicFound from "../errors/NoMusicFound";
const youtubesearchapi = require('youtube-search-api');

export default class MusicSearch{

    static async search(query: string): Promise<SearchInfoDTO>{
        const searchDTO: SearchDTO = await youtubesearchapi.GetListByKeyword(query, false)
        for (let i = 0; i < searchDTO.items.length; i++){
            if (searchDTO.items[i].type === 'video'){
                return  searchDTO.items[i]
            }
        }
        throw new NoMusicFound()
    }
}

export interface SearchInfoDTO {
    id: string
    type: string
    url: string
    thumbnail: string
    title: string
    length: string
    videos: VideoInfo[] | undefined
}

export interface VideoInfo {
    id: string
    type: string
    url: string
    thumbnail: string | undefined
    title: string
    length: string,
}

export interface SearchInfoDTO{
    id: string,
    type: string,
    thumbnail: {
        thumbnails: [Thumbnail]
    }
    title: string,
    length: {
        accessibility: {
            accessibilityData: {
                label: string
            }
        },
        simpleText: string
    }
}

interface Thumbnail {
    url: string,
    width: number,
    height: number
}

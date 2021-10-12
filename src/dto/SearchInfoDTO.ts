export interface SearchInfoDTO{
    id: string,
    type: string,
    thumbnail: {
        thumbnails: [
            url: string,
            width: number,
            height: number
        ]
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

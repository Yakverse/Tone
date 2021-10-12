import {SearchInfoDTO} from "./SearchInfoDTO";

export interface SearchDTO {
    items: [SearchInfoDTO],
    nextPage: {
        nextPageToken: string,
        nextPageContext: {
            context: {
                client: {
                    hl: string,
                    gl: string,
                    remoteHost: string,
                    deviceMake: string,
                    deviceModel: string,
                    visitorData: string,
                    userAgent: string,
                    clientName: string,
                    clientVersion: string,
                    osName: string,
                    osVersion: '',
                    originalUrl: string,
                    platform: string,
                    clientFormFactor: string,
                    configInfo: {
                        appInstallData: string
                    }
                },
                user: {
                    lockedSafetyMode: boolean
                },
                request: {
                    useSsl: boolean
                },
                clickTracking: {
                    clickTrackingParams: string
                }

            },
            continuation: string
        }
    }
}

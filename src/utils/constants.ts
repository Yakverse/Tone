export const BOT = {
    TOKEN: process.env.TOKEN || '',
    PREFIX: process.env.PREFIX || '',
    INVITE_URL: process.env.INVITE_URL || '',
}

export const LOG = {
    ENABLE: process.env.LOG === 'true',
    NEW_RELIC_KEY: process.env.NEW_RELIC_KEY || '',
}

export const PLAYER = {
    COOKIE: process.env.COOKIE || '',
    PLAYLIST_LIMIT: parseInt(process.env.PLAYLIST_LIMIT || '0', 10),
}

export const MISC = {
    YTB_BLOCK: process.env.YTB_BLOCK == "true" ? true : false,
    RETRIES: isNaN(process.env.RETRIES as any) ? 5 : process.env.RETRIES as any,
    TIMEOUT_RATE_LIMIT: isNaN(process.env.TIMEOUT_RATE_LIMIT as any) ? 60 * 60 * 1000 : process.env.TIMEOUT_RATE_LIMIT as any, //1h
}
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
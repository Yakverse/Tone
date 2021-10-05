import BotError from "./botError";

export default class MusicAlreadyPaused extends BotError{
    name: string = 'Music already paused'
    message: string = 'Your music is already paused'
}
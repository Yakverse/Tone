import BotError from "./botError";

export default class NoTracksToSkip extends BotError{
    name: string = 'No remaing tracks'
    message: string = 'There is no more tracks for you to skip'
}
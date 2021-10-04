import BotError from "./botError";

export default class NoRemaingTracks extends BotError{
    name: string = 'No remaing tracks'
    message: string = 'There is no more tracks in your current queue'
}
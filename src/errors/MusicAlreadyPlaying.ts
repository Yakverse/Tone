import BotError from "./botError";

export default class MusicAlreadyPlaying extends BotError{
    name: string = 'Music already playing'
    message: string = 'Your music is already playing'
}
import BotError from "./botError";

export default class NoMusicFound extends BotError{
    name: string = 'No music found';
    message: string = 'No music found';
}
